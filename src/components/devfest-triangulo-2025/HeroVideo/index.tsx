import React from "react";
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
    <section className="relative isolate min-h-[600px] w-full overflow-hidden bg-black md:min-h-[700px] lg:aspect-video lg:min-h-0">
      <div className="pointer-events-none absolute inset-0 scale-125">
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

      <div className="absolute inset-0 z-10 bg-black/80" />

      <div className="absolute inset-0 z-20 mx-auto flex w-full max-w-xl flex-col items-center justify-center px-6 text-center text-devWhite-ice">
        <Image
          alt="DevFest Triângulo 2026"
          src={AndroidCheese}
          priority
          className="h-auto w-48 object-contain sm:w-64 lg:w-72"
        />
        <Image
          alt="DevFest Triângulo 2026"
          src={Title}
          priority
          className="h-auto w-full max-w-lg object-contain"
        />
        <div className="mt-4 flex flex-col items-center gap-3 text-sm sm:flex-row sm:gap-6 sm:text-base">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-5 text-devYellow" />
            <span>31 de Outubro</span>
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-5 text-devYellow" />
            <span>Uberlândia - MG</span>
          </span>
        </div>
      </div>

      {children}
    </section>
  );
};
