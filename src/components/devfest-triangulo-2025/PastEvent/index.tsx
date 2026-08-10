import Image from "next/image";

import Instagram from "@/public/devfest-2025/icons/instagram.svg";
import LeftBracket from "@/public/devfest-2025/left-bracket.svg";
import RightBracket from "@/public/devfest-2025/right-bracket.svg";

import styles from "./PastEvent.module.css";

interface PastEventProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PastEvent = ({ className, ...rest }: PastEventProps) => {
  return (
    <section className={className} {...rest}>
      <div className={styles.FullRow}>
        <section className={styles.Caroussel}>
          <div className={styles.CustomLeftBracket}>
            <Image src={LeftBracket} alt="" />
          </div>
          <iframe
            className={styles.IFrame}
            src="https://www.youtube.com/embed/QCYaPiFo_4k?modestbranding=1&rel=0"
            title="Como foi o DevFest Triângulo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <div className={styles.CustomRightBracket}>
            <Image src={RightBracket} alt="" />
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
