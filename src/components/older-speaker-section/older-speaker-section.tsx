import { Speaker } from "models/speaker";
import React from "react";
import styles from "styles/OlderSpeakerSection.module.css";
import SpeakerCard from "./speaker-card";


interface SpeakersSectionProps {
  speakers: Array<Speaker>,
}

const OlderSpeakerSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  return (
    <div className={styles.Container}>
      <header className={styles.Header}>
        <img className={styles.ConectorImage} src="/connector.png" />
        <h1 className={styles.Title}>Palestrantes</h1>
      </header>
      <div className={styles.Body}>
        {speakers && speakers.map((speaker) => {
          return <SpeakerCard

            key={speaker.slug}
            speaker={speaker}
          />
        })}
      </div>
    </div>
  );
};
export default OlderSpeakerSection;
