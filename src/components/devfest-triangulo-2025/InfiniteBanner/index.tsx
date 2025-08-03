"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import styles from "./InfiniteBanner.module.css";
import clsx from "clsx";

interface InfiniteBannerProps {
  items: string[];
  speed?: number;
  direction?: "leftToRight" | "rightToLeft";
  className?: string;
}

export const InfiniteBanner = ({
  items,
  speed = 40,
  direction = "leftToRight",
  className,
}: InfiniteBannerProps) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const repeatedItems = Array(20).fill(items).flat();

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.scrollWidth / 2);
    }
  }, []);

  const flow =
    direction === "leftToRight" ? { x: [-width, 0] } : { x: [0, -width] };

  return (
    <section className={clsx(styles.InfiniteBanner, className)}>
      <div className={styles.InfiniteBannerWrapper}>
        <motion.div
          ref={containerRef}
          className={styles.InfiniteBannerTrack}
          animate={flow}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: speed,
          }}
        >
          {repeatedItems.map((item, index) => (
            <span className={styles.InfiniteBannerItem} key={index}>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
