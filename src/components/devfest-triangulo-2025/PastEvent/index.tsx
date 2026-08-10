"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

import Instagram from "@/public/devfest-2025/icons/instagram.svg";
import LeftBracket from "@/public/devfest-2025/left-bracket.svg";
import RightBracket from "@/public/devfest-2025/right-bracket.svg";

import styles from "./PastEvent.module.css";

interface PastEventProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PastEvent = ({ className, ...rest }: PastEventProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className={className} {...rest}>
      <div className="flex flex-col items-center bg-devGray-dark py-10">
        <div className="relative aspect-video w-[90%] max-w-6xl">
          <div className="absolute -left-4 top-1/2 z-10 w-9 -translate-y-1/2">
            <Image src={LeftBracket} alt="" />
          </div>
          {isPlaying ? (
            <iframe
              className="absolute inset-0 h-full w-full rounded-2xl bg-black"
              src="https://www.youtube.com/embed/QCYaPiFo_4k?autoplay=1&modestbranding=1&rel=0&vq=hd1080"
              title="Como foi o DevFest Triângulo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="group absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border-0 bg-black"
              onClick={() => setIsPlaying(true)}
              aria-label="Reproduzir vídeo de eventos passados"
            >
              <Image
                src="https://i.ytimg.com/vi/QCYaPiFo_4k/maxresdefault.jpg"
                alt="Prévia do vídeo do DevFest Triângulo"
                fill
                quality={100}
                sizes="(min-width: 1280px) 1152px, 90vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
              />
              <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
              <span className="absolute left-1/2 top-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-devBlue-dark text-white shadow-xl transition-transform group-hover:scale-110 motion-reduce:transition-none">
                <Play className="ml-1 size-7 fill-current" />
              </span>
            </button>
          )}
          <div className="absolute -right-4 top-1/2 z-10 w-9 -translate-y-1/2">
            <Image src={RightBracket} alt="" />
          </div>
        </div>
        <a
          href="https://www.instagram.com/devfesttriangulo/"
          target="_blank"
          className={styles.InstaLink}
        >
          <Image src={Instagram} alt="" />
          Veja mais em @devfesttriangulo
        </a>
      </div>
    </section>
  );
};
