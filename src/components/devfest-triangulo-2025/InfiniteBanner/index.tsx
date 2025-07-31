import { useEffect, useRef, useState } from "react";

import styles from "./InfiniteBanner.module.css";

interface InfiniteBannerProps {
  speed?: number;
  direction?: "left" | "right";
}

const items = ["Os ingressos são limitados"];

export const InfiniteBanner = ({
  speed = 40,
  direction = "left",
}: InfiniteBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const lastTimestamp = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const singleItemWidth = 302 + 32;
    const containerWidth = container.offsetWidth;

    const itemsPerRow = Math.ceil(containerWidth / singleItemWidth);
    setCopies(Math.max(2, itemsPerRow * 2));
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (lastTimestamp.current === null) lastTimestamp.current = timestamp;
      const elapsed = timestamp - lastTimestamp.current;
      lastTimestamp.current = timestamp;

      const distance = (speed * elapsed) / 1000;

      if (direction === "right") {
        container.scrollLeft += distance;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      } else {
        container.scrollLeft -= distance;
        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth / 2;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, direction, copies]);

  const renderedItems = Array.from({ length: copies }, (_, copyIdx) =>
    items.map((item, i) => (
      <div key={`${copyIdx}-${i}`} className={styles.Item}>
        {item}
      </div>
    )),
  );

  return (
    <div className={styles.InfiniteBanner}>
      <div ref={containerRef} className={styles.Container}>
        {renderedItems}
      </div>
    </div>
  );
};
