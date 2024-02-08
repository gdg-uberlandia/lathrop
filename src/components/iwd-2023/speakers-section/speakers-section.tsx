import { Speaker } from "models/speaker";
import React from "react";
import styles from "./SpeakerSection.module.css";
import SpeakerCard from "./speaker-card";


interface SpeakersSectionProps {
  speakers: Array<Speaker>,
}

const SpeakerSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  return (
    <div className={styles.Container}>
      <header className={styles.Header}>
        <img className={styles.ConectorImage} src="/connector.png" />
        <h1 className={styles.Title}>Palestrantes</h1>
      </header>
      <div className={styles.Body}>
        {speakers && speakers.map((speaker) => {
          return <SpeakerCard

            key={speaker.key}
            speaker={speaker}
          />
        })}
      </div>
    </div>
  );
};
export default SpeakerSection;
