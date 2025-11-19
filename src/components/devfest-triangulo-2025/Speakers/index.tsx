import { Speaker } from "models/speaker";

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
  speakers: Array<Speaker>;
}

export const Speakers = ({ speakers }: SpeakersProps) => {
  return (
    <section className={styles.Speakers}>
      <h1 className={styles.Title}>
        <span>Quem</span> inspira o presente e constrói o futuro, está aqui
      </h1>
      <p>
        Conheça as mentes e os temas incríveis que subirão ao palco do
        {` ${configValues.name}`}.
      </p>
      {speakers.length ? (
        <section className={styles.SpeakersList}>
          {speakers
            .filter((speaker) => speaker.showSpeaker === true)
            .map((speaker, idx) => (
              <SpeakerCard key={idx} speaker={speaker} index={idx} />
            ))}
        </section>
      ) : (
        <section className={styles.TagList}>
          {tags.map((tag, idx) => (
            <div key={idx} className={styles.Tag}>
              {tag}
            </div>
          ))}
        </section>
      )}
    </section>
  );
};
