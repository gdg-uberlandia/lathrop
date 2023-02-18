import React from "react";
import styles from "styles/OlderSpeakerSection.module.css";
import SpeakerCard from "./speaker-card";
const OlderSpeakerSection: React.FC = ({}) => {
  return (
    <div className={styles.Container}>
      <header className={styles.Header}>
        <img className={styles.ConectorImage} src="/connector.png" />
        <h1 className={styles.Title}>Palestrantes</h1>
      </header>
      <div className={styles.Body}>
        <SpeakerCard
          name={"Nome do palestrante"}
          instagram={"@instagram_aqui"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mi purus, bibendum ac ultricies
             et, aliquam eu ex. Vestibulum posuere 
             feugiat neque.`}
        />
        <SpeakerCard
          name={"Nome do palestrante"}
          instagram={"@instagram_aqui"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mi purus, bibendum ac ultricies
             et, aliquam eu ex. Vestibulum posuere 
             feugiat neque.`}
        />
        <SpeakerCard
          name={"Nome do palestrante"}
          instagram={"@instagram_aqui"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mi purus, bibendum ac ultricies
             et, aliquam eu ex. Vestibulum posuere 
             feugiat neque.`}
        />
        <SpeakerCard
          name={"Nome do palestrante"}
          instagram={"@instagram_aqui"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mi purus, bibendum ac ultricies
             et, aliquam eu ex. Vestibulum posuere 
             feugiat neque.`}
        />
        <SpeakerCard
          name={"Nome do palestrante"}
          instagram={"@instagram_aqui"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mi purus, bibendum ac ultricies
             et, aliquam eu ex. Vestibulum posuere 
             feugiat neque.`}
        />
        <SpeakerCard
          name={"Nome do palestrante"}
          instagram={"@instagram_aqui"}
          description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mi purus, bibendum ac ultricies
             et, aliquam eu ex. Vestibulum posuere 
             feugiat neque.`}
        />
      </div>
    </div>
  );
};
export default OlderSpeakerSection;
