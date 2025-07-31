import React, { useEffect, useRef } from "react";

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
  const markerRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const activeCount = Math.floor((value / max) * (totalMarkers - 1));
    markerRefs.current.forEach((mark, mIdx) => {
      if (!mark) return;
      if (mIdx <= activeCount) {
        console.log("mark", mark.className);
        mark.classList.add(styles.MarkerActive);
        const percent = mIdx / (totalMarkers + 1);
        mark.style.backgroundPosition = `${percent * 100}% 0`;
        mark.style.backgroundSize = `${totalMarkers * 100}% 100%`;
      } else {
        mark.classList.remove(styles.MarkerActive);
        mark.style.backgroundPosition = "";
        mark.style.backgroundSize = "";
      }
    });
  }, [value, max, totalMarkers]);

  return (
    <div className={styles.CountdownItem}>
      <div className={styles.CircleTimerContainer}>
        {createMarkers(totalMarkers).map((_, mIdx) => (
          <div
            key={mIdx}
            className={`${styles.Marker}`}
            ref={(el) => {
              if (el) markerRefs.current[mIdx] = el;
            }}
            style={{
              transform: `rotate(${
                (mIdx / totalMarkers) * 360
              }deg) translate(0%, calc(-250% - ${3}px))`,
              width: `${markerWith > 10 ? "10" : markerWith}px`,
              left: `calc(${50}% - ${markerWith / 2}px)`,
            }}
          />
        ))}
        <span className={styles.CountdownItemValue} id={unitId}>
          {value}
        </span>
      </div>
      <div className={styles.CountdownItemLabel}>{label}</div>
    </div>
  );
};
