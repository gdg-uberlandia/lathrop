import { Speaker } from "models/speaker";
import React from "react";
import styles from "./SpeakerSection.module.css";
import SpeakerCard from "./speaker-card";


interface SpeakersSectionProps {
  speakers: Array<Speaker>,
}

const SpeakerSection = ({ speakers }: SpeakersSectionProps) => {
  return (
    <div className={styles.Container}>
        {speakers.map((speaker) => 
          <SpeakerCard
            key={speaker.slug}
            speaker={speaker}
          />
        )}
    </div>
  );
};
export default SpeakerSection;
