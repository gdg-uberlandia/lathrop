import styles from "./CountdownItem.module.css";

type CountdownItemProps = {
  unitId: string;
  value: number;
  label: string;
  max: number;
  totalMarkers?: number;
  markerWith?: number;
};

function createMarkers(total: number) {
  return Array.from({ length: total }, (_, i) => i);
}

export const CountdownItem = ({
  unitId,
  value,
  label,
  max,
  totalMarkers = 16,
  markerWith = 2,
}: CountdownItemProps) => {
  const activeCount = Math.floor((value / max) * (totalMarkers - 1));

  return (
    <div
      className={styles.CountdownItem}
      role="timer"
      aria-label={`${value} ${label}`}
    >
      <div className={styles.CircleTimerContainer}>
        {createMarkers(totalMarkers).map((_, mIdx) => {
          const isActive = mIdx <= activeCount;
          const percent = mIdx / (totalMarkers + 1);

          return (
            <div
              key={mIdx}
              className={`${styles.Marker} ${
                isActive ? styles.MarkerActive : ""
              }`}
              style={{
                transform: `rotate(${
                  (mIdx / totalMarkers) * 360
                }deg) translate(0%, calc(-250% - ${3}px))`,
                width: `${markerWith > 10 ? "10" : markerWith}px`,
                left: `calc(${50}% - ${markerWith / 2}px)`,
                ...(isActive
                  ? {
                      backgroundPosition: `${percent * 100}% 0`,
                      backgroundSize: `${totalMarkers * 100}% 100%`,
                    }
                  : {}),
              }}
            />
          );
        })}
        <span className={styles.CountdownItemValue} id={unitId}>
          {value}
        </span>
      </div>
      <div className={styles.CountdownItemLabel}>{label}</div>
    </div>
  );
};
