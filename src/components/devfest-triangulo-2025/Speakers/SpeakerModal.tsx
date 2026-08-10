import { PublicSpeaker } from "models/speaker";
import { PublicTalk } from "models/talk";
import Image from "next/image";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import { CloseMenu } from "@/assets/images/CloseMenu";
import { Tag } from "@/components/devfest-triangulo-2025/Tag";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarFrame1 from "@/public/devfest-2025/avatar-frame-1.svg";
import AvatarFrame2 from "@/public/devfest-2025/avatar-frame-2.svg";
import AvatarFrame3 from "@/public/devfest-2025/avatar-frame-3.svg";
import AvatarFrame4 from "@/public/devfest-2025/avatar-frame-4.svg";
import AvatarNotFound from "@/public/devfest-2025/icons/avatar-not-found.svg";

import styles from "./Speakers.module.css";

const frames = [AvatarFrame1, AvatarFrame2, AvatarFrame3, AvatarFrame4];

interface ModalProps {
  index: number;
  modalOpen: boolean;
  modalToggle: () => void;
  speaker: PublicSpeaker;
  talks: PublicTalk[];
}

const SpeakerModal: React.FC<ModalProps> = ({
  index,
  speaker,
  talks,
  modalOpen,
  modalToggle,
}) => {
  const selectedFrame = frames[index % frames.length];

  const closeBtn = (
    <button
      type="button"
      onClick={modalToggle}
      className="inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark"
      aria-label={`Fechar detalhes de ${speaker.name}`}
    >
      <CloseMenu color="#4285F4" width={24} height={24} />
    </button>
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
                src={speaker.photoUrl || AvatarNotFound}
                alt={`Foto ${speaker.name}`}
                height={200}
                width={200}
              />
              <Image
                className={styles.AvatarOverlay}
                src={selectedFrame}
                alt="Moldura do avatar"
              />
            </div>
            <div className={styles.SocialMedia}>
              {speaker.socialMedia && (
                <>
                  {speaker.socialMedia.instagram && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={speaker.socialMedia.instagram}
                      aria-label={`Instagram de ${speaker.name}`}
                    >
                      <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                  )}
                  {speaker.socialMedia.linkedIn && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={speaker.socialMedia.linkedIn}
                      aria-label={`LinkedIn de ${speaker.name}`}
                    >
                      <FontAwesomeIcon icon={faLinkedin} size="2x" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.ModalSpeakerInfo}>
            <div className={styles.SpeakerInfo}>
              <h2>{speaker.name}</h2>
              <span className={styles.CardTech}>
                {speaker.title ? (
                  <>{speaker.title}</>
                ) : (
                  <>
                    {" "}
                    {speaker.company && " · "}
                    {speaker.company}
                  </>
                )}
              </span>
            </div>
            <div>
              {talks.map((talk) => (
                <div key={talk.id}>
                  <Tag>
                    <>
                      {talk.format === "keynote"
                        ? "Keynote"
                        : talk.format === "panel"
                          ? "Painel"
                          : "Talk"}
                    </>
                  </Tag>
                  <h3 className="mt-2">{talk.title}</h3>
                  <p>{talk.description}</p>
                </div>
              ))}

              {speaker.miniBio && (
                <div className="mt-4">
                  <Tag>
                    <>Sobre mim</>
                  </Tag>
                  <p>{speaker.miniBio}</p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SpeakerModal;
