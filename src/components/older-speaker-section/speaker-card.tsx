import React from "react";
import styles from "styles/SpeakerCard.module.css";

const SpeakerCard: React.FC<{
  name: string;
  instagram: string;
  description: string;
}> = ({ name, instagram, description }) => {
  return (
    <div className={styles.CardBorder}>
      <div className={styles.CardWrapper}>
        <img className={styles.SpeakerImg} src="/arte-palestrante.png"></img>
        <h2 className={styles.SpeakerName}>{name}</h2>
        <p className={styles.SpeakerInstagram}>{instagram}</p>
        <p className={styles.Description}>{description}</p>
      </div>
    </div>
  );
};
export default SpeakerCard;
