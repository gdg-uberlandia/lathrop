/*eslint-disable*/
import { Speaker } from "models/speaker";
import Image from "next/image";
import React, { useState } from "react";

import styles from "./styles/Speakers.module.css";
import SpeakerModal from "./speaker-modal";

interface SpeakerCardProps extends Speaker { }

const SpeakerCard: React.FC<SpeakerCardProps> = (speaker) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalToggle = () => setModalOpen(!modalOpen);

  return (
    <>
      <div className={styles.card_content} onClick={modalToggle}>
        <Image
          unoptimized
          className={styles.card_image}
          src={speaker.photo ? speaker.photo : ""}
          alt={`Foto ${speaker.name}`}
          height={120}
          width={120}
        />
        <h2 className={styles.card_name}>{speaker.name}</h2>
        <p className={styles.card_topic}>{speaker.tech}</p>
        <p className={styles.card_profile}>{speaker.title}</p>
      </div>
      <SpeakerModal
        speaker={speaker}
        modalOpen={modalOpen}
        modalToggle={modalToggle}
      />
    </>
  );
};

export default SpeakerCard;
