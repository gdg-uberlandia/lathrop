import { Speaker } from "models/speaker";
import React from "react";
import styles from "./SpeakerCard.module.css";
import clsx from "clsx";
import Image from "next/image";

interface SpeakerCardProps {
  speaker: Speaker;
  color: 'primary' | 'secondary' | 'tertiary' | string;
  onSelectSpeaker: () => void;
  active?: boolean;
}

const SPEAKER_TOPIC_CHAR_CHUNK = 22;

const SpeakerCard = ({ speaker, active, color, onSelectSpeaker }: SpeakerCardProps) => {
  const speakerTopicChunks = speaker.topic?.split('').reduce((acc, current) => {
    const shouldAddNextChunk = current === ' ' && acc[acc.length - 1].length >= SPEAKER_TOPIC_CHAR_CHUNK;
    if (shouldAddNextChunk) {
      acc.push(current);
      return acc;
    }
    acc[acc.length - 1] += current;
    return acc;
  }, ['']);

  return (
    <article className={
      clsx(
        styles.SpeakerCard,
        styles.SpeakerCardFilled,
        active ? styles.Active : styles.Inactive,
      )
    }>
      <p>
        {speakerTopicChunks?.map((chunk) =>
          <span key={chunk} className={clsx(styles.SpeakerCardTitle, styles[color])}>
            {chunk}
          </span>
        )}
      </p>
      <div style={{ position: 'relative', maxWidth: '300px' }}>

        <Image
          alt="Internation Women`s Day 2024"
          src={speaker.photo}
          className={styles.SpeakerCardImage}
          height={active ? 140 : 129}
          width={active ? 140 : 129}
        />
      </div>
      <a className={styles.SpeakerCardFooter}>
        <span className={styles.ArrowIcon}>
          <Image alt="Uma seta apontando pra diagonal direita na cor branca" src='/icons/arrow-icon.svg' width={16} height={16} />
        </span>
        <p className={styles.SpeakerCardFooterText} onClick={onSelectSpeaker}>
          Ler mais sobre: <strong>{speaker.name}</strong>
        </p>
      </a>
    </article>
  );
};
export default SpeakerCard;
