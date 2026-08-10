import clsx from "clsx";
import { PublicSpeaker } from "models/speaker";
import { PublicTalk } from "models/talk";
import Image from "next/image";
import { useEffect, useState } from "react";

import { TruncatedText } from "@/components/TruncatedText";
import AvatarFrame1 from "@/public/devfest-2025/avatar-frame-1.webp";
import AvatarFrame2 from "@/public/devfest-2025/avatar-frame-2.webp";
import AvatarFrame3 from "@/public/devfest-2025/avatar-frame-3.webp";
import AvatarFrame4 from "@/public/devfest-2025/avatar-frame-4.webp";
import AvatarNotFound from "@/public/devfest-2025/icons/avatar-not-found.webp";

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
      <article
        className={clsx(
          variant ? styles.CardContentVariant : styles.CardContent,
          "relative",
        )}
      >
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] border-0 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue-dark"
          onClick={modalToggle}
          aria-label={`Ver detalhes de ${speaker.name}`}
          aria-haspopup="dialog"
        />
        <div className={styles.CardImageWrapper}>
          <Image
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
          <h3 className={styles.CardName}>{speaker.name}</h3>

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
      </article>

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
