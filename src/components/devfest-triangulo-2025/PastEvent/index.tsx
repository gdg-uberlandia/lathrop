import Image from "next/image";
import { useEffect } from "react";

import Instagram from "@public/devfest-2025/icons/instagram.svg";
import LeftBracket from "@public/devfest-2025/left-bracket.svg";
import RightBracket from "@public/devfest-2025/right-bracket.svg";

import styles from "./PastEvent.module.css";

interface PastEventProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PastEvent = ({ className, ...rest }: PastEventProps) => {
  const youtubeVideoId = "csAx-6rJ1L8";
  useEffect(() => {
    const isMobile = /iPhone|Android|Mobile/i.test(navigator.userAgent);

    function createPlayer() {
      new (window as any).YT.Player("youtube-player", {
        videoId: youtubeVideoId,
        events: {
          onStateChange: (event: any) => {
            if (event.data === 1 && isMobile) {
              const iframe = event.target.getIframe();
              if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
              } else if ((iframe as any).webkitRequestFullscreen) {
                (iframe as any).webkitRequestFullscreen();
              } else if ((iframe as any).mozRequestFullScreen) {
                (iframe as any).mozRequestFullScreen();
              } else if ((iframe as any).msRequestFullscreen) {
                (iframe as any).msRequestFullscreen();
              }
            }
          },
        },
      });
    }

    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }
  }, [youtubeVideoId]);
  return (
    <section className={className} {...rest}>
      <div className={styles.FullRow}>
        <section className={styles.Caroussel}>
          <div className={styles.CustomLeftBracket}>
            <Image src={LeftBracket} alt="" layout="responsive" />
          </div>
          <div id="youtube-player" className={styles.IFrame}></div>
          <div className={styles.CustomRightBracket}>
            <Image src={RightBracket} alt="" layout="responsive" />
          </div>
        </section>
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
