import { PublicSpeakerSummary } from "@/contracts/speaker";
import { PublicTalkSummary } from "@/contracts/talk";

import configValues from "@/helpers/config";

import SpeakerCard from "./SpeakerCard";
import styles from "./Speakers.module.css";
import clsx from "clsx";
import { SectionHeading } from "../ui/SectionHeading";

const tags: string[] = [
  "Arquitetura",
  "Carreira",
  "Dados",
  "Tecnologias web",
  "QA",
  "Inteligência artificial",
  "Design",
  "Machine Learning",
  "Games",
  "DevOps",
  "E muito mais...",
];

interface SpeakersProps {
  speakers: Array<PublicSpeakerSummary>;
  talks: Array<PublicTalkSummary>;
  className?: string;
}

export const Speakers = ({
  speakers = [],
  talks = [],
  className,
}: SpeakersProps) => {
  return (
    <section
      className={clsx(
        "flex w-full flex-col items-center gap-6 text-center",
        className,
      )}
      aria-labelledby="speakers-title"
    >
      <SectionHeading id="speakers-title">
        <span>Quem</span> inspira o presente e constrói o futuro, está aqui
      </SectionHeading>

      {speakers.length ? (
        <>
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Conheça as mentes e os temas incríveis que subirão ao palco do
            {` ${configValues.name}`}.
          </p>
          <div className={styles.SpeakersList}>
            {speakers?.map((speaker, idx) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                talks={talks.filter((talk) =>
                  talk.speakerIds.includes(speaker.id),
                )}
                index={idx}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Em breve conheça as mentes e os temas incríveis que subirão ao palco
            do
            {` ${configValues.name}`}.
          </p>
          <div className="flex max-w-4xl flex-wrap justify-center gap-3">
            {tags.map((tag, idx) => (
              <div
                key={idx}
                className="inline-flex rounded-full bg-devfest-gradient p-px"
              >
                <div className="inline-flex min-h-9 items-center rounded-full bg-black px-4 py-2 text-sm text-white/80 sm:text-base">
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
