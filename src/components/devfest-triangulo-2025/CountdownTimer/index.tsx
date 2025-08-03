import clsx from "clsx";
import configValues from "helpers/config";
import { calcDateDistance, changeTimeZone } from "helpers/date";
import { useEffect, useState } from "react";

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
  const [_dateDistance, _setDateDistance] = useState({
    distance: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  } as Record<string, number>);

  useEffect(() => {
    const _interval = setInterval(function () {
      const _result = calcDateDistance(
        changeTimeZone(configValues.eventDate, "America/Sao_Paulo"),
      );

      if (_result.distance < 0) {
        clearInterval(_interval);
        return;
      }

      _setDateDistance(_result);
    }, 1000);

    return () => {
      clearInterval(_interval);
    };
  }, []);

  return (
    <section className={clsx(styles.CountdownTimer, className)} {...rest}>
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
