import { getSchedule } from "back-features/schedule";
import { getSpeakers } from "back-features/speakers";
import { getSponsors } from "back-features/sponsors";
import { CountdownTimer } from "components/devfest-triangulo-2025/CountdownTimer";
import { Header } from "components/devfest-triangulo-2025/Header";
import { Presentation } from "components/devfest-triangulo-2025/Presentation";
import { Schedule } from "models/schedule";
import { Speaker } from "models/speaker";
import { SponsorLevel } from "models/sponsor-level";
import styles from "styles/Home.module.css";

import { ExtraInfo } from "@components/devfest-triangulo-2025/ExtraInfo";
import { Hero } from "@components/devfest-triangulo-2025/Hero";
import { InfiniteBanner } from "@components/devfest-triangulo-2025/InfiniteBanner";
import { PastEvent } from "@components/devfest-triangulo-2025/PastEvent";
import { EventLocation } from "@components/devfest-triangulo-2025/EventLocation";

import ErrorBoundary from "../components/error-boundary";
import BaseLayout from "../layouts/base-layout";

import BusinesCenter from "@public/devfest-2025/icons/business_center.svg";
import ChildCare from "@public/devfest-2025/icons/child_care.svg";
import Handshake from "@public/devfest-2025/icons/handshake.svg";
import Mic from "@public/devfest-2025/icons/mic.svg";
import Trophy from "@public/devfest-2025/icons/trophy.svg";
import { Faq } from "@components/devfest-triangulo-2025/Faq";

interface HomePageProps {
  speakers: Array<Speaker>;
  sponsors: { [key: string]: SponsorLevel };
  schedule: Array<Schedule>;
}

const Home = ({ speakers, sponsors, schedule }: HomePageProps) => {
  return (
    <>
      <ErrorBoundary>
        <Header />

        <Hero />

        <section className={styles.Section}>
          <Presentation
            tags={[
              { icon: Mic, text: "Palestras inspiradoras" },
              { icon: BusinesCenter, text: "Estandes de empresas" },
              { icon: Trophy, text: "Dinâmicas interativas" },
              { icon: Handshake, text: "Networking sem fronteiras" },
              { icon: ChildCare, text: "Área kids" },
            ]}
            title={
              <>
                Onde mentes curiosas se conectam e{" "}
                <span>o futuro é programado em comunidade</span>
              </>
            }
            button={{
              text: "Fazer parte do DevFest",
              href: "",
            }}
            description=" O DevFest é um super festival de tecnologia feito por e para a
        comunidade, com o apoio do Google Developer Groups (GDG). É onde ideias
        ganham vida, conexões acontecem e o futuro da tecnologia é construído
        com colaboração, diversidade e muita energia criativa."
            subtitle="Se você ama tecnologia, adora aprender e quer fazer parte de algo
        transformador, esse evento é pra você!"
          />
        </section>

        <section className={styles.Section}>
          <CountdownTimer />
        </section>

        <section className={styles.Section}>
          <PastEvent />
        </section>

        <section className={styles.Section}>
          <ExtraInfo />
        </section>

        <section className={styles.Section}>
          <InfiniteBanner
            direction="leftToRight"
            items={["Os ingressos são limitados", "Garanta sua vaga"]}
            speed={70}
          />
        </section>

        <section className={styles.Section}>
          <Presentation
            tags={[
              { text: "Arquitetura" },
              { text: "Carreira" },
              { text: "Dados" },
              { text: "Tecnologias web" },
              { text: "QA" },
              { text: "Inteligência artificial" },
              { text: "Design" },
              { text: "Machine Learning" },
              { text: "Games" },
              { text: "Devops" },
              { text: "E muito mais..." },
            ]}
            title={
              <>
                <span>Quem</span> inspira o presente e constrói o futuro, está
                aqui
              </>
            }
            subtitle="Em breve conheça as mentes e os temas incríveis que subirão ao palco do DevFest."
          />
        </section>

        <section className={styles.Section}>
          <Presentation
            title={
              <>
                <span>Marcas</span> que acreditam no poder da tecnologia e da
                comunidade têm lugar garantido
              </>
            }
            subtitle="Seja um patrocinador do melhor festival de tecnologia da América Latina e conecte sua marca a milhares de mentes curiosas, criativas e apaixonadas por inovação. 
No DevFest, sua empresa não só ganha visibilidade, ela se torna parte ativa da transformação do ecossistema tech!"
            button={{
              text: "Quero apoiar o DevFest",
              href: "",
            }}
          />
        </section>

        <section className={styles.Section}>
          <EventLocation />
        </section>

        <section className={styles.Section}>
          <Faq />
        </section>
      </ErrorBoundary>
    </>
  );
};

export async function getServerSideProps() {
  try {
    return {
      props: {
        speakers: await getSpeakers(),
        sponsors: await getSponsors(),
        schedule: await getSchedule(),
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { speakers: [], sponsors: [] } };
  }
}

Home.layout = BaseLayout;

export default Home;
