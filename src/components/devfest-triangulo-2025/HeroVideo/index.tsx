"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import AndroidCheese from "@/public/devfest-2026/android_queijo_.webp";
import Title from "@/public/devfest-2025/logo-2026.webp";
import { CalendarDays, MapPin } from "lucide-react";

interface Props {
  videoId: string;
  children?: React.ReactNode;
}

export const HeroVideo = ({ videoId, children }: Props) => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoUrl = `https://www.youtube.com/embed/${encodeURIComponent(
    videoId,
  )}?autoplay=1&mute=1&controls=0&loop=1&playlist=${encodeURIComponent(
    videoId,
  )}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&vq=hd720&enablejsapi=1`;

  const controlVideo = (shouldPlay: boolean) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: shouldPlay ? "playVideo" : "pauseVideo",
        args: [],
      }),
      "https://www.youtube.com",
    );
  };

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadVideo = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setShouldLoadVideo(true), {
          timeout: 1500,
        });
      } else {
        timeoutId = setTimeout(() => setShouldLoadVideo(true), 500);
      }
    };

    if (document.readyState === "complete") loadVideo();
    else window.addEventListener("load", loadVideo, { once: true });

    return () => {
      window.removeEventListener("load", loadVideo);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVideoReady) controlVideo(isHeroVisible);
  }, [isHeroVisible, isVideoReady]);

  return (
    <section
      ref={heroRef}
      className="relative isolate h-[calc(100svh-68px)] min-h-[480px] w-full overflow-hidden bg-black"
    >
      <h1 className="sr-only">DevFest Triângulo 2026</h1>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {shouldLoadVideo && (
          <iframe
            ref={iframeRef}
            src={videoUrl}
            title="Vídeo do DevFest Triângulo"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            aria-hidden="true"
            frameBorder="0"
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            onLoad={() => setIsVideoReady(true)}
          />
        )}
      </div>

      <div className="absolute inset-0 z-10 bg-black/80" />

      <div className="absolute inset-0 z-20 mx-auto flex w-full max-w-xl flex-col items-center justify-center px-6 py-6 text-center text-devWhite-ice">
        <Image
          alt="DevFest Triângulo 2026"
          src={AndroidCheese}
          priority
          className="h-auto w-36 object-contain [@media(min-height:700px)]:w-52 [@media(min-height:900px)]:w-64"
        />
        <Image
          alt="DevFest Triângulo 2026"
          src={Title}
          priority
          className="h-auto w-full max-w-sm object-contain [@media(min-height:800px)]:max-w-lg"
        />
        <div className="mt-3 flex flex-col items-center gap-2 text-sm sm:flex-row sm:gap-6 [@media(min-height:800px)]:mt-4 [@media(min-height:800px)]:text-base">
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
