import { PublicSpeaker } from "models/speaker";
import { PublicTalk } from "models/talk";

import configValues from "@/helpers/config";

import SpeakerCard from "./SpeakerCard";
import styles from "./Speakers.module.css";

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
}

export const Speakers = ({ speakers = [], talks = [] }: SpeakersProps) => {
  return (
    <section className={styles.Speakers}>
      <h1 className={styles.Title}>
        <span>Quem</span> inspira o presente e constrói o futuro, está aqui
      </h1>

      {speakers.length ? (
        <>
          <p>
            Conheça as mentes e os temas incríveis que subirão ao palco do
            {` ${configValues.name}`}.
          </p>
          <section className={styles.SpeakersList}>
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
          </section>
        </>
      ) : (
        <>
          <p>
            Em breve conheça as mentes e os temas incríveis que subirão ao palco
            do
            {` ${configValues.name}`}.
          </p>
          <section className={styles.TagList}>
            {tags.map((tag, idx) => (
              <div key={idx} className={styles.Tag}>
                {tag}
              </div>
            ))}
          </section>
        </>
      )}
    </section>
  );
};
