import React from "react";

import styles from "../styles/Speakers.module.css";
import SpeakerCard from "@/components/devfest-triangulo-2025/Speakers/SpeakerCard";

import { PublicSpeaker, toPublicSpeaker } from "models/speaker";
import { PublicTalk, toPublicTalk } from "models/talk";

import configValues from "helpers/config";
import { Header } from "@/components/devfest-triangulo-2025/Header";
import BaseLayout from "layouts/base-layout";
import { getAllSpeakers } from "back-features/speakers";
import { getAllTalks } from "back-features/talks";

interface SpeakersPageProps {
  speakers: Array<PublicSpeaker>;
  talks: Array<PublicTalk>;
}

const SpeakersPage = ({ speakers, talks }: SpeakersPageProps) => {
  return (
    <BaseLayout>
      <Header isRoot={false} />

      <div className={styles.SpeakersWrapper}>
        <div className={styles.Section}></div>
        <h1 className={styles.Title}>Palestrantes</h1>

        <p>
          As pessoas palestrantes do {configValues.name} possuem uma variedade
          de experiências, que vão desde pessoas desenvolvedoras experientes à
          lideres de comunidades. As pessoas que palestram com frenquência se
          engajam em conversas técnicas em suas empresas, cidades e países. No
          Devfest você pode esperar palestras de Google Developer Experts, Tech
          Leads, pessoas desenvolvedoras e resolvedores de problemas.
        </p>
        <section className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {speakers
            .filter((speaker) => speaker.isVisible)
            .map((speaker, index) => (
              <SpeakerCard
                speaker={speaker}
                talks={talks.filter(
                  (talk) =>
                    talk.isActive && talk.speakerIds.includes(speaker.id),
                )}
                index={index}
                key={speaker.id}
                variant
              />
            ))}
        </section>
      </div>
    </BaseLayout>
  );
};

export async function getServerSideProps() {
  try {
    const [speakers, talks] = await Promise.all([
      getAllSpeakers(),
      getAllTalks(),
    ]);

    return {
      props: {
        speakers: speakers.map(toPublicSpeaker),
        talks: talks.map(toPublicTalk),
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { speakers: [], talks: [] } };
  }
}

export default SpeakersPage;
