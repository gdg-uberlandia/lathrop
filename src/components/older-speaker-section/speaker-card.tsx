import { Speaker } from "models/speaker";
import React from "react";
import styles from "styles/SpeakerCard.module.css";

const SpeakerCard: React.FC<{
  speaker: Speaker;
}> = ({ speaker }) => {
  return (
    <div className={styles.CardBorder}>
      <div className={styles.CardWrapper}>
        <div className={styles.SpeakerImgWrapper}>
          <img className={styles.SpeakerImg} src={speaker.photo}></img>

          <img className={styles.SpeakerImgFrame} src="/frame.png"></img>
        </div>
        <h2 className={styles.SpeakerName}>{speaker.name}</h2>
        {/*<p className={styles.SpeakerInstagram}>{speaker?.socialMedia?.instagram}</p>*/}
        <p className={styles.Description}>{speaker.miniBio}</p>
      </div>
    </div>
  );
};
export default SpeakerCard;
