import { getSchedule } from "back-features/schedule";
import { getAllSpeakers } from "back-features/speakers";
import { getAllSponsorLevels } from "back-features/sponsors";

import { CountdownTimer } from "components/devfest-triangulo-2025/CountdownTimer";
import { Header } from "components/devfest-triangulo-2025/Header";
import { Presentation } from "components/devfest-triangulo-2025/Presentation";
import { Schedule } from "models/schedule";
import { Speaker } from "models/speaker";
import styles from "styles/Home.module.css";

import { HeroVideo } from "@/components/devfest-triangulo-2025/HeroVideo";
import { InfiniteBanner } from "@/components/devfest-triangulo-2025/InfiniteBanner";
import { PastEvent } from "@/components/devfest-triangulo-2025/PastEvent";
import { EventLocation } from "@/components/devfest-triangulo-2025/EventLocation";

import ErrorBoundary from "../components/error-boundary";
import BaseLayout from "../layouts/base-layout";

import BusinesCenter from "@/public/devfest-2025/icons/business_center.svg";
import ChildCare from "@/public/devfest-2025/icons/child_care.svg";
import Handshake from "@/public/devfest-2025/icons/handshake.svg";
import Mic from "@/public/devfest-2025/icons/mic.svg";
import Trophy from "@/public/devfest-2025/icons/trophy.svg";
import configValues from "@/helpers/config";
import { SponsorsSection } from "@/components/devfest-triangulo-2025/SponsorsSection";
import { SponsorLevel } from "models/sponsor";

import {
  devfest2023Images,
  devfest2024Images,
  devfest2025Images1,
  devfest2025Images2,
} from "@/helpers/carroussel";
import { Faq } from "@/components/devfest-triangulo-2025/Faq";
import { Tickets } from "@/components/devfest-triangulo-2025/Tickets";
import { Speakers } from "@/components/devfest-triangulo-2025/Speakers";
import { HeroSection } from "@/components/hero-section";

interface HomePageProps {
  initialSpeakers: Array<Speaker>;
  initialSponsors: Array<SponsorLevel>;
  initialSchedule: Array<Schedule>;
}

const Home = ({
  initialSpeakers,
  initialSponsors,
  initialSchedule,
}: HomePageProps) => {
  return (
    <>
      <ErrorBoundary>
        <Header />

        <HeroVideo videoUrl="https://www.youtube.com/watch?v=QCYaPiFo_4k" />

        <Presentation
          tags={[
            { icon: Mic, text: "Palestras inspiradoras" },
            { icon: BusinesCenter, text: "Estandes de empresas" },
            { icon: Trophy, text: "Dinâmicas interativas" },
            { icon: Handshake, text: "Networking sem fronteiras" },
          ]}
          title={
            <>
              Onde mentes curiosas se conectam e{" "}
              <span>o futuro é programado em comunidade</span>
            </>
          }
          button={{
            text: "Fazer parte do DevFest",
            href: configValues.eventLinkSponsorshipUrl,
          }}
          description=" O DevFest é um super festival de tecnologia feito por e para a
        comunidade, com o apoio do Google Developer Groups (GDG). É onde ideias
        ganham vida, conexões acontecem e o futuro da tecnologia é construído
        com colaboração, diversidade e muita energia criativa."
          subtitle="Se você ama tecnologia, adora aprender e quer fazer parte de algo
        transformador, esse evento é pra você!"
          className={styles.Section}
          id="about"
        />

        <InfiniteBanner
          direction="leftToRight"
          items={devfest2025Images1}
          speed={2000}
          className={styles.Section}
          id="infinite-banner"
        />
        <InfiniteBanner
          direction="rightToLeft"
          items={devfest2025Images2}
          speed={2000}
          className={styles.Section}
          id="infinite-banner"
        />
        <CountdownTimer className={styles.Section} id="countdown" />

        <Presentation
          tags={[
            { text: "O maior da América Latina" },
            { text: "+ 2.000 participantes" },
            { text: "4 trilhas de conteúdo" },
            { text: "+ 20 palestras" },
          ]}
          title={
            <>
              Como foi a <span>última edição</span>
            </>
          }
          description={`O ${configValues.lastEvent}, em Uberlândia, foi um verdadeiro marco e
          mostrou o poder da comunidade em ação:`}
          className={styles.Section}
          id="past-event"
        ></Presentation>

        <PastEvent />

        <Presentation
          title={
            <>
              <span>Garanta a sua vaga</span> no DevFest
            </>
          }
          subtitle="O maior DevFest da América Latina está chegando, e o melhor é que você
        pode fazer parte disso tudo. Aprendizado, conexão, experiências únicas e
        muita inovação te esperam."
          className={styles.Section}
          id="registration"
        ></Presentation>

        <Tickets />

        <InfiniteBanner
          direction="leftToRight"
          items={[
            { type: "text", content: "Café da Manhã" },
            { type: "text", content: "Lanche da Tarde" },
            { type: "text", content: "Acesso aos Palcos" },
            { type: "text", content: "Certificado de Participação" },
            { type: "text", content: "Brindes" },
          ]}
          speed={140}
          className={styles.Section}
          id="infinite-banner"
        />

        <Speakers speakers={[]} />

        <InfiniteBanner
          direction="rightToLeft"
          items={devfest2023Images}
          speed={2000}
          className={styles.Section}
          id="infinite-banner"
        />

        <InfiniteBanner
          direction="leftToRight"
          items={devfest2024Images}
          speed={2000}
          className={styles.Section}
          id="infinite-banner"
        />

        <SponsorsSection
          className={styles.Section}
          sponsors={[]}
          id="sponsors"
        />

        {/* <EventLocation className={styles.Section} id="place" /> */}

        <Faq className={styles.Section} id="faq" />
      </ErrorBoundary>
    </>
  );
};

export async function getServerSideProps() {
  try {
    return {
      props: {
        initialSpeakers: await getAllSpeakers(),
        initialSponsors: await getAllSponsorLevels(),
        initialSchedule: await getSchedule(),
      },
    };
  } catch (error) {
    console.error("Erro ao ler props iniciais:", error);
    return { props: { speakers: [], sponsors: [] } };
  }
}

Home.layout = BaseLayout;

export default Home;
