"use client";

import styles from "./InfiniteBanner.module.css";
import clsx from "clsx";
import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";

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
  const duration = Math.max(speed / 10, 0.1);
  const bannerRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    let isIntersecting = true;
    const updateActivity = () => {
      setIsActive(isIntersecting && document.visibilityState === "visible");
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateActivity();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(banner);
    document.addEventListener("visibilitychange", updateActivity);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, []);

  const renderItems = (copy: number) =>
    items.map((item, index) => (
      <div
        className={styles.InfiniteBannerItem}
        key={`${copy}-${item.type}-${index}`}
      >
        {item.type === "text" && (
          <span className={styles.InfiniteBannerItemSpan}>{item.content}</span>
        )}
        {item.type === "image" && (
          <div className={styles.InfiniteBannerImage}>
            <Image
              src={item.src}
              alt={item.alt ?? ""}
              fill
              sizes="300px"
              className="object-contain"
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
            playsInline
          />
        )}
      </div>
    ));

  return (
    <section
      ref={bannerRef}
      className={clsx(styles.InfiniteBanner, className)}
      {...rest}
    >
      <div className={styles.InfiniteBannerWrapper}>
        <div
          className={clsx(
            styles.InfiniteBannerTrack,
            direction === "leftToRight"
              ? styles.LeftToRight
              : styles.RightToLeft,
          )}
          style={
            {
              "--marquee-duration": `${duration}s`,
              animationPlayState: isActive ? "running" : "paused",
            } as CSSProperties
          }
        >
          <div className={styles.InfiniteBannerGroup}>{renderItems(0)}</div>
          <div className={styles.InfiniteBannerGroup} aria-hidden="true">
            {renderItems(1)}
          </div>
        </div>
      </div>
    </section>
  );
};
