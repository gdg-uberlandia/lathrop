import styles from "./CountdownTimer.module.css";

import React, { useState, useEffect } from "react";
import { changeTimeZone, calcDateDistance } from "helpers/date";

import configValues from "helpers/config";

const DATE_DISTANCE_LABELS: Record<string, string> = {
  days: "dias",
  hours: "horas",
  minutes: "minutos",
  seconds: "segundos",
};

const CountdownTimer: React.FC = ({}) => {
  const [_dateDistance, _setDateDistance] = useState({
    distance: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  } as Record<string, number>);

  useEffect(() => {
    const _interval = setInterval(function () {
      const now = new Date();
      const _result = calcDateDistance({
        initialDate: now,
        endDate: changeTimeZone(configValues.eventDate, "America/Sao_Paulo"),
      });

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
    <section className={styles.Counter}>
      <ul className={styles.CounterList}>
        {Object.keys(DATE_DISTANCE_LABELS).map((key) => (
          <li className={styles.CounterListItem} key={key}>
            <span className={styles.CounterListItem__time}>
              {_dateDistance[key]}
            </span>
            {DATE_DISTANCE_LABELS[key]}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CountdownTimer;
