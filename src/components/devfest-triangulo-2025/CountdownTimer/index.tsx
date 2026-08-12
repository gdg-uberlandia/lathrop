import clsx from "clsx";
import configValues from "@/helpers/config";
import { calcDateDistance, changeTimeZone } from "@/helpers/date";
import { useEffect, useRef, useState } from "react";

import { CountdownItem } from "./CountdownItem";
import styles from "./CountdownTimer.module.css";

const UNITS_MAX_VALUES: Record<string, number> = {
  days: 99,
  hours: 23,
  minutes: 59,
  seconds: 59,
};

const DATE_DISTANCE_LABELS: Record<string, string> = {
  days: "dias",
  hours: "horas",
  minutes: "minutos",
  seconds: "segundos",
};

interface CountdownTimerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CountdownTimer = ({ className, ...rest }: CountdownTimerProps) => {
  const timerRef = useRef<HTMLElement>(null);
  const [_dateDistance, _setDateDistance] = useState<Record<string, number>>({
    distance: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = timerRef.current;
    if (!timer) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    let isIntersecting = false;

    const update = () => {
      const _result = calcDateDistance(
        changeTimeZone(configValues.eventDate, "America/Sao_Paulo"),
      );

      if (_result.distance < 0) {
        if (interval) clearInterval(interval);
        interval = undefined;
        return;
      }

      _setDateDistance(_result);
    };

    const updateActivity = () => {
      const shouldRun =
        isIntersecting && document.visibilityState === "visible";

      if (shouldRun && !interval) {
        update();
        interval = setInterval(update, 1000);
      } else if (!shouldRun && interval) {
        clearInterval(interval);
        interval = undefined;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateActivity();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(timer);
    document.addEventListener("visibilitychange", updateActivity);

    return () => {
      if (interval) clearInterval(interval);
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, []);

  return (
    <section
      ref={timerRef}
      className={clsx(styles.CountdownTimer, className)}
      {...rest}
    >
      {Object.keys(DATE_DISTANCE_LABELS).map((key, idx) => (
        <CountdownItem
          key={`${key}-${idx}`}
          unitId={key}
          value={_dateDistance[key]}
          label={DATE_DISTANCE_LABELS[key]}
          max={UNITS_MAX_VALUES[key]}
          totalMarkers={16}
          markerWith={10}
        />
      ))}
    </section>
  );
};
