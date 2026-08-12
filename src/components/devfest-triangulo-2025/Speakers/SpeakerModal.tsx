import { PublicSpeaker } from "@/contracts/speaker";
import { PublicTalk } from "@/contracts/talk";
import { shouldBypassImageOptimization } from "@/helpers/image";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { CloseMenu } from "@/assets/images/CloseMenu";
import { Tag } from "@/components/devfest-triangulo-2025/Tag";
import AvatarFrame1 from "@/public/devfest-2025/avatar-frame-1.webp";
import AvatarFrame2 from "@/public/devfest-2025/avatar-frame-2.webp";
import AvatarFrame3 from "@/public/devfest-2025/avatar-frame-3.webp";
import AvatarFrame4 from "@/public/devfest-2025/avatar-frame-4.webp";
import AvatarNotFound from "@/public/devfest-2025/icons/avatar-not-found.webp";

import styles from "./Speakers.module.css";

const frames = [AvatarFrame1, AvatarFrame2, AvatarFrame3, AvatarFrame4];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M6.5 8.25H3V21h3.5V8.25ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.85-2.05-5.65-4.8-5.65a4.15 4.15 0 0 0-3.75 2.05V8.25H9V21h3.5v-6.3c0-1.65.3-3.25 2.35-3.25 2 0 2.05 1.9 2.05 3.35V21H21v-7.3Z" />
  </svg>
);

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") modalToggle();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, modalToggle]);

  if (!modalOpen) return null;

  const closeBtn = (
    <button
      type="button"
      ref={closeButtonRef}
      onClick={modalToggle}
      className="inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark"
      aria-label={`Fechar detalhes de ${speaker.name}`}
    >
      <CloseMenu color="#4285F4" width={24} height={24} />
    </button>
  );

  return createPortal(
    <div
      className={styles.ModalBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) modalToggle();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`speaker-modal-title-${speaker.id}`}
        className={styles.ModalBody}
      >
        <div className={styles.ModalHeader}>{closeBtn}</div>
        <div className={styles.Social}>
          <div className={styles.CardImageWrapper}>
            <Image
              className={styles.CardImage}
              src={speaker.photoUrl || AvatarNotFound}
              unoptimized={shouldBypassImageOptimization(speaker.photoUrl)}
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
                    <InstagramIcon />
                  </a>
                )}
                {speaker.socialMedia.linkedIn && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={speaker.socialMedia.linkedIn}
                    aria-label={`LinkedIn de ${speaker.name}`}
                  >
                    <LinkedInIcon />
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.ModalSpeakerInfo}>
          <div className={styles.SpeakerInfo}>
            <h2 id={`speaker-modal-title-${speaker.id}`}>{speaker.name}</h2>
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
      </div>
    </div>,
    document.body,
  );
};

export default SpeakerModal;
