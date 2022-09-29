/*eslint-disable*/

import speakers from "hooks/useSpeakers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  faTwitter,
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../styles/Speakers.module.css";
import { Speaker } from "models/speaker";

interface ModalProps {
  modalOpen: boolean;
  modalToggle: () => void;
  id: number;
}

const SpeakerModal: React.FC<ModalProps> = ({ id, modalOpen, modalToggle }) => {
  const [speaker, setSpeaker] = useState<Speaker>({} as Speaker);

  useEffect(() => {
    for (let speaker of speakers) {
      if (speaker.id === id) {
        setSpeaker(speaker);
      }
    }
  }, []);

  return (
    <Modal
      isOpen={modalOpen}
      toggle={modalToggle}
      centered
      size="lg"
      scrollable
    >
      <ModalHeader toggle={modalToggle} className={styles.modal_header}>
        <div className={styles.modal_speaker_info_container}>
          <Image
            unoptimized
            className={styles.card_image}
            src={speaker.photo}
            alt={`Foto ${speaker.name}`}
            width="100%"
            height="100%"
          />
          <div className={styles.modal_speaker_info_content}>
            <h1>{speaker.name}</h1>
            <p>{speaker.tech}</p>
            <p>{speaker.title}</p>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <h2>{speaker.topic}</h2>
        <p>{speaker.mini_bio}</p>
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        {speaker.social_media && (
          <>
            {speaker.social_media.twitter && (
              <a target="_blank" href={speaker.social_media.twitter}>
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
            )}
            {speaker.social_media.instagram && (
              <a target="_blank" href={speaker.social_media.instagram}>
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
            )}
            {speaker.social_media.github && (
              <a target="_blank" href={speaker.social_media.github}>
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
            )}
            {speaker.social_media.linkedIn && (
              <a target="_blank" href={speaker.social_media.linkedIn}>
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            )}
            {speaker.social_media.website && (
              <a target="_blank" href={speaker.social_media.website}>
                <FontAwesomeIcon icon={faArrowPointer} size="2x" />
              </a>
            )}
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default SpeakerModal;
