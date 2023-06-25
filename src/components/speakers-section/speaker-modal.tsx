/*eslint-disable*/

import Image from "next/image";
import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  faTwitter,
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./styles/Speakers.module.css";
import { Speaker } from "models/speaker";

interface ModalProps {
  modalOpen: boolean;
  modalToggle: () => void;
  speaker: Speaker;
}

const SpeakerModal: React.FC<ModalProps> = ({
  speaker,
  modalOpen,
  modalToggle,
}) => {
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
            src={speaker.photo ? speaker.photo : ""}
            alt={`Foto ${speaker.name}`}
            fill
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
        <p>{speaker.content}</p>

        <h2>Mini bio</h2>
        <p>{speaker.miniBio}</p>
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        {speaker.socialMedia && (
          <>
            {speaker.socialMedia.twitter && (
              <a target="_blank" href={speaker.socialMedia.twitter}>
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
            )}
            {speaker.socialMedia.instagram && (
              <a target="_blank" href={speaker.socialMedia.instagram}>
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
            )}
            {speaker.socialMedia.github && (
              <a target="_blank" href={speaker.socialMedia.github}>
                <FontAwesomeIcon icon={faGithub} size="2x" />
              </a>
            )}
            {speaker.socialMedia.linkedIn && (
              <a target="_blank" href={speaker.socialMedia.linkedIn}>
                <FontAwesomeIcon icon={faLinkedin} size="2x" />
              </a>
            )}
            {speaker.socialMedia.website && (
              <a target="_blank" href={speaker.socialMedia.website}>
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
