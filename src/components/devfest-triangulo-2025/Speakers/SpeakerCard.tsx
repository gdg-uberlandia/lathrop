import clsx from "clsx";
import { PublicSpeaker } from "models/speaker";
import { PublicTalk } from "models/talk";
import Image from "next/image";
import { useEffect, useState } from "react";

import { TruncatedText } from "@/components/TruncatedText";
import AvatarFrame1 from "@/public/devfest-2025/avatar-frame-1.svg";
import AvatarFrame2 from "@/public/devfest-2025/avatar-frame-2.svg";
import AvatarFrame3 from "@/public/devfest-2025/avatar-frame-3.svg";
import AvatarFrame4 from "@/public/devfest-2025/avatar-frame-4.svg";
import AvatarNotFound from "@/public/devfest-2025/icons/avatar-not-found.svg";

import SpeakerModal from "./SpeakerModal";
import styles from "./Speakers.module.css";

const frames = [AvatarFrame1, AvatarFrame2, AvatarFrame3, AvatarFrame4];

interface SpeakerCardProps {
  speaker: PublicSpeaker;
  index: number;
  talks: PublicTalk[];
  variant?: boolean;
}

const SpeakerCard = ({
  speaker,
  talks,
  index,
  variant = false,
}: SpeakerCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [maxLength, setMaxLength] = useState(124);

  const modalToggle = () => setModalOpen(!modalOpen);

  const selectedFrame = frames[index % frames.length];

  useEffect(() => {
    const updateLength = () => {
      setMaxLength(window.innerWidth < 860 ? 68 : 124);
    };

    updateLength();
    window.addEventListener("resize", updateLength);

    return () => window.removeEventListener("resize", updateLength);
  }, []);

  return (
    <>
      <div
        className={variant ? styles.CardContentVariant : styles.CardContent}
        onClick={modalToggle}
      >
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

        <div className={styles.CardText}>
          <h2 className={styles.CardName}>{speaker.name}</h2>

          <p className={clsx(styles.CardTech)}>
            {speaker.title ? (
              <>{speaker.title}</>
            ) : (
              <>
                {" "}
                {speaker.company && " · "}
                {speaker.company}
              </>
            )}
          </p>
          {talks.length > 0 && (
            <div className={styles.CardDescription}>
              <TruncatedText
                text={talks.map((talk) => talk.title).join(" · ")}
                maxChars={maxLength}
              />
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4 18L5 16.6L14.6 7H6V5H18V17H16V8.4L6.4 18Z"
                  fill="#4285F4"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <SpeakerModal
        index={index}
        speaker={speaker}
        talks={talks}
        modalOpen={modalOpen}
        modalToggle={modalToggle}
      />
    </>
  );
};

export default SpeakerCard;
