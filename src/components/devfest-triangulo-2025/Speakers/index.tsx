import { PublicSpeaker } from "models/speaker";
import { PublicTalk } from "models/talk";

import configValues from "@/helpers/config";

import SpeakerCard from "./SpeakerCard";
import clsx from "clsx";

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
  speakers: Array<PublicSpeaker>;
  talks: Array<PublicTalk>;
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
    >
      <h2 className="max-w-4xl text-balance text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl [&_span]:text-devBlue-dark">
        <span>Quem</span> inspira o presente e constrói o futuro, está aqui
      </h2>

      {speakers.length ? (
        <>
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Conheça as mentes e os temas incríveis que subirão ao palco do
            {` ${configValues.name}`}.
          </p>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {speakers
              ?.filter((speaker) => speaker.isVisible)
              .map((speaker, idx) => (
                <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  talks={talks.filter(
                    (talk) =>
                      talk.isActive && talk.speakerIds.includes(speaker.id),
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
