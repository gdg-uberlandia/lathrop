import { Speaker } from "models/speaker";
import Image from "next/image";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import { CloseMenu } from "@assets/images/CloseMenu";
import { Tag } from "@components/devfest-triangulo-2025/Tag";
import {
  faGithub,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarFrame1 from "@public/devfest-2025/avatar-frame-1.svg";
import AvatarFrame2 from "@public/devfest-2025/avatar-frame-2.svg";
import AvatarFrame3 from "@public/devfest-2025/avatar-frame-3.svg";
import AvatarFrame4 from "@public/devfest-2025/avatar-frame-4.svg";
import AvatarNotFound from "@public/devfest-2025/icons/avatar-not-found.svg";

import styles from "./Speakers.module.css";

const frames = [AvatarFrame1, AvatarFrame2, AvatarFrame3, AvatarFrame4];

interface ModalProps {
  index: number;
  modalOpen: boolean;
  modalToggle: () => void;
  speaker: Speaker;
}

const SpeakerModal: React.FC<ModalProps> = ({
  index,
  speaker,
  modalOpen,
  modalToggle,
}) => {
  const selectedFrame = frames[index % frames.length];

  const closeBtn = (
    <span onClick={modalToggle}>
      <CloseMenu color="#4285F4" width={24} height={24} />
    </span>
  );

  return (
    <>
      <Modal
        isOpen={modalOpen}
        toggle={modalToggle}
        centered
        size="xl"
        scrollable
        className={styles.Modal}
      >
        <ModalBody className={styles.ModalBody}>
          <ModalHeader
            toggle={modalToggle}
            close={closeBtn}
            className={styles.ModalHeader}
          />
          <div className={styles.Social}>
            <div className={styles.CardImageWrapper}>
              <Image
                unoptimized
                className={styles.CardImage}
                src={speaker.photo || AvatarNotFound}
                alt={`Foto ${speaker.name}`}
                height={200}
                width={200}
              />
              <Image
                className={styles.AvatarOverlay}
                src={selectedFrame}
                alt="Moldura do avatar"
                height={200}
                width={200}
              />
            </div>
            <div className={styles.SocialMedia}>
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
            </div>
          </div>

          <div className={styles.ModalSpeakerInfo}>
            <div className={styles.SpeakerInfo}>
              <h1>{speaker.name}</h1>
              <span className={styles.CardTech}>
                {speaker.title ? (
                  <>{speaker.title}</>
                ) : (
                  <>
                    {" "}
                    {speaker.tech}
                    {speaker.tech && speaker.company ? " - " : ""}
                    {speaker.company}
                  </>
                )}
              </span>
            </div>
            <div>
              {speaker.content && (
                <>
                  <Tag>
                    <>Palestra</>
                  </Tag>
                  <p>{speaker.content}</p>
                </>
              )}

              {speaker.miniBio && (
                <>
                  <Tag>
                    <>Sobre mim</>
                  </Tag>
                  <p>{speaker.miniBio}</p>
                </>
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SpeakerModal;
