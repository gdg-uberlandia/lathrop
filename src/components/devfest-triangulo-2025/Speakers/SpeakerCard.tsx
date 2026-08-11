import clsx from "clsx";
import { PublicSpeaker, PublicSpeakerSummary } from "@/contracts/speaker";
import { PublicTalk, PublicTalkSummary } from "@/contracts/talk";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { TruncatedText } from "@/components/TruncatedText";
import AvatarFrame1 from "@/public/devfest-2025/avatar-frame-1.webp";
import AvatarFrame2 from "@/public/devfest-2025/avatar-frame-2.webp";
import AvatarFrame3 from "@/public/devfest-2025/avatar-frame-3.webp";
import AvatarFrame4 from "@/public/devfest-2025/avatar-frame-4.webp";
import AvatarNotFound from "@/public/devfest-2025/icons/avatar-not-found.webp";

import styles from "./Speakers.module.css";

const SpeakerModal = dynamic(() => import("./SpeakerModal"), {
  ssr: false,
});

const frames = [AvatarFrame1, AvatarFrame2, AvatarFrame3, AvatarFrame4];

interface SpeakerCardProps {
  speaker: PublicSpeakerSummary;
  index: number;
  talks: PublicTalkSummary[];
  variant?: boolean;
}

interface SpeakerDetails {
  speaker: PublicSpeaker;
  talks: PublicTalk[];
}

const SpeakerCard = ({
  speaker,
  talks,
  index,
  variant = false,
}: SpeakerCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<SpeakerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const closeModal = () => setModalOpen(false);

  const openModal = async () => {
    if (details) {
      setModalOpen(true);
      return;
    }

    setIsLoading(true);
    setLoadError("");
    try {
      const response = await fetch(
        `/api/public/speakers/${encodeURIComponent(speaker.id)}/`,
      );
      if (!response.ok) throw new Error("Não foi possível carregar os dados.");

      const speakerDetails = (await response.json()) as SpeakerDetails;
      setDetails(speakerDetails);
      setModalOpen(true);
    } catch {
      setLoadError("Não foi possível carregar os detalhes. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFrame = frames[index % frames.length];

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
          onClick={openModal}
          disabled={isLoading}
          aria-label={
            isLoading
              ? `Carregando detalhes de ${speaker.name}`
              : `Ver detalhes de ${speaker.name}`
          }
          aria-haspopup="dialog"
          aria-busy={isLoading}
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
              <span className="min-[860px]:hidden">
                <TruncatedText
                  text={talks.map((talk) => talk.title).join(" · ")}
                  maxChars={68}
                />
              </span>
              <span className="hidden min-[860px]:inline">
                <TruncatedText
                  text={talks.map((talk) => talk.title).join(" · ")}
                  maxChars={124}
                />
              </span>
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

      {loadError && (
        <p className="mt-2 text-sm text-devRed" role="alert">
          {loadError}
        </p>
      )}

      {modalOpen && details && (
        <SpeakerModal
          index={index}
          speaker={details.speaker}
          talks={details.talks}
          modalOpen={modalOpen}
          modalToggle={closeModal}
        />
      )}
    </>
  );
};

export default SpeakerCard;
