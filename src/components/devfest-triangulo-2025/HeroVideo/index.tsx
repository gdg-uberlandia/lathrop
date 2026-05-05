"use client";

import React from "react";
import ReactPlayer from "react-player";
import styles from "./HeroVideo.module.css";
import Image from "next/image";

import AndroidCheese from "@/public/devfest-2025/android-cheese.png";
import Title from "@/public/devfest-2025/devfest-logo.png";

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
          alt="DevFest Triângulo 2025"
          src={AndroidCheese}
          loading="eager"
          className="mr-6 "
        />
        <Image
          alt="DevFest Triângulo 2025"
          src={Title}
          loading="eager"
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>
  );
};
