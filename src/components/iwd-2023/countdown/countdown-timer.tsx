import { useEffect, useState } from "react";
import styles from "./CountdownTimer.module.css";

const CountdownTimer: React.FC = ({ }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date("03/25/2023 08:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime() > 0 ? target.getTime() - now.getTime() : 0;
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.timer_wrapper}>
      <div>
        <div className={styles.number_wrapper}>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_days_wrapper}>
                {Math.floor(days / 10)}
              </div>
            </div>
          </div>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_days_wrapper}>{days % 10}</div>
            </div>
          </div>
        </div>
        <p className={styles.time_text}>Dias</p>
      </div>
      <div>
        <div className={styles.number_wrapper}>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_hours_wrapper}>
                {Math.floor(hours / 10)}
              </div>
            </div>
          </div>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_hours_wrapper}>{hours % 10}</div>
            </div>
          </div>
        </div>
        <p className={styles.time_text}>Horas</p>
      </div>
      <div>
        <div className={styles.number_wrapper}>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_minutes_wrapper}>
                {Math.floor(minutes / 10)}
              </div>
            </div>
          </div>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_minutes_wrapper}>{minutes % 10}</div>
            </div>
          </div>
        </div>
        <p className={styles.time_text}>Minutos</p>
      </div>
      <div>
        <div className={styles.number_wrapper}>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_seconds_wrapper}>
                {Math.floor(seconds / 10)}
              </div>
            </div>
          </div>
          <div className={styles.outer_wrapper}>
            <div className={styles.inbetween_wrapper}>
              <div className={styles.inner_seconds_wrapper}>{seconds % 10}</div>
            </div>
          </div>
        </div>
        <p className={styles.time_text}>Segundos</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
