"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import styles from "./InfiniteBanner.module.css";
import clsx from "clsx";
import Image from "next/image";

export type BannerItem =
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

interface InfiniteBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BannerItem[];
  speed?: number;
  direction?: "leftToRight" | "rightToLeft";
}

export const InfiniteBanner = ({
  items,
  speed = 40,
  direction = "leftToRight",
  className,
  ...rest
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
    <section className={clsx(styles.InfiniteBanner, className)} {...rest}>
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
            <div className={styles.InfiniteBannerItem} key={index}>
              {item.type === "text" && (
                <span className={styles.InfiniteBannerItemSpan}>
                  {item.content}
                </span>
              )}
              {item.type === "image" && (
                <div className={styles.InfiniteBannerImage}>
                  <Image
                    src={item.src}
                    alt={item.alt ?? ""}
                    fill
                    sizes="300px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
              {item.type === "video" && (
                <video
                  src={item.src}
                  poster={item.poster}
                  autoPlay
                  loop
                  muted
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
