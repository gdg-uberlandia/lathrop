"use client";

import React from "react";
import ReactPlayer from "react-player";
import styles from "./HeroVideo.module.css";
import Image from "next/image";

import AndroidCheese from "@/public/devfest-2026/android_queijo_.png";
import Title from "@/public/devfest-2025/logo-2026.png";
import { CalendarDays, MapPin } from "lucide-react";

interface Props {
  videoUrl: string;
  children?: React.ReactNode;
}

export const HeroVideo = ({ videoUrl, children }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.video}>
        <ReactPlayer
          src={videoUrl}
          playing
          loop
          muted
          controls={false}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                disablekb: 1,
              },
            } as any,
          }}
        />
      </div>

      {/* overlay escuro */}
      <div className={styles.overlay} />

      {/* conteúdo */}
      <div className={styles.content}>
        <Image
          alt="DevFest Triângulo 2026"
          src={AndroidCheese}
          loading="eager"
          className="mr-6 top-0 left-0"
        />
        <Image
          alt="DevFest Triângulo 2026"
          src={Title}
          loading="eager"
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
    </div>
  );
};
