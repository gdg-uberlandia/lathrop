import React from "react";
import styles from "./HeroVideo.module.css";
import Image from "next/image";

import AndroidCheese from "@/public/devfest-2026/android_queijo_.png";
import Title from "@/public/devfest-2025/logo-2026.png";
import { CalendarDays, MapPin } from "lucide-react";

interface Props {
  videoId: string;
  children?: React.ReactNode;
}

export const HeroVideo = ({ videoId, children }: Props) => {
  const videoUrl = `https://www.youtube.com/embed/${encodeURIComponent(
    videoId,
  )}?autoplay=1&mute=1&controls=0&loop=1&playlist=${encodeURIComponent(
    videoId,
  )}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.video}>
        <iframe
          src={videoUrl}
          title="Vídeo do DevFest Triângulo"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          aria-hidden="true"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>

      {/* overlay escuro */}
      <div className={styles.overlay} />

      {/* conteúdo */}
      <div className={styles.content}>
        <Image
          alt="DevFest Triângulo 2026"
          src={AndroidCheese}
          priority
          className="mr-6 top-0 left-0"
        />
        <Image
          alt="DevFest Triângulo 2026"
          src={Title}
          priority
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <footer className="flex gap-4 mt-2">
          <span className="flex items-center gap-2">
            <CalendarDays />
            <span className="pt-1">31 de Outubro</span>
          </span>
          <span className="flex items-center gap-2">
            <MapPin />
            <span className="pt-1">Uberlândia - MG</span>
          </span>
        </footer>
      </div>

      {children}
    </div>
  );
};
