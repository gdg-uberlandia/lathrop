import { Speaker } from "models/speaker";
import React from "react";
import styles from "./SpeakerSection.module.css";
import clsx from "clsx";
import Image from "next/image";

interface SpeakerCardProps {
  speaker: Speaker;
  color: 'primary' | 'secondary' | 'tertiary';
  active?: boolean;
}

const SpeakerCard = ({ speaker, active, color }: SpeakerCardProps) => {
  return (
    <article className={
      clsx(
        styles.SpeakerCard,
        styles.SpeakerCardFilled,
        active ? styles.Active : styles.Inactive,
      )
    }>  
      <p className={clsx(styles.SpeakerCardTitle, styles[color])}>
        {speaker.content}
      </p>
      <Image alt="Internation Women`s Day 2024" src='/iwd-2024/circle-iwd-svg.svg' width={active ? 154 : 129} height={active ? 154 : 129} className={styles.SpeakerCardImage} />
      <a className={styles.SpeakerCardFooter}>
        <span className={styles.ArrowIcon}>
          <Image alt="Uma seta apontando pra diagonal direita na cor branca" src='/icons/arrow-icon.svg' width={16} height={16} />
        </span>
        <p className={styles.SpeakerCardFooterText}>
          Ler mais sobre: <strong>{speaker.name}</strong>
        </p>
      </a>
    </article>
  );
};
export default SpeakerCard;
