import { getAllSpeakers } from "@/back-features/speakers";
import { getAllSponsorLevels } from "@/back-features/sponsors";
import { getAllTalks } from "@/back-features/talks";
import type { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";

import { CountdownTimer } from "@/components/devfest-triangulo-2025/CountdownTimer";
import { Header } from "@/components/devfest-triangulo-2025/Header";
import { Presentation } from "@/components/devfest-triangulo-2025/Presentation";
import { PublicSpeakerSummary } from "@/contracts/speaker";
import { PublicTalkSummary } from "@/contracts/talk";
import type { SponsorLevel } from "@/models/sponsor";
import styles from "@/styles/Home.module.css";

import { HeroVideo } from "@/components/devfest-triangulo-2025/HeroVideo";
import { InfiniteBanner } from "@/components/devfest-triangulo-2025/InfiniteBanner";

import ErrorBoundary from "../components/error-boundary";
import BaseLayout from "../layouts/base-layout";

import BusinesCenter from "@/public/devfest-2025/icons/business_center.svg";
import Handshake from "@/public/devfest-2025/icons/handshake.svg";
import Mic from "@/public/devfest-2025/icons/mic.svg";
import Trophy from "@/public/devfest-2025/icons/trophy.svg";
import configValues from "@/helpers/config";

import {
  devfest2023Images,
  devfest2024Images,
  devfest2025Images1,
  devfest2025Images2,
} from "@/helpers/carroussel";
import {
  deferredHomepageSectionClassName,
  homepageSectionClassName,
} from "@/components/devfest-triangulo-2025/ui/section-styles";

const PastEvent = dynamic(() =>
  import("@/components/devfest-triangulo-2025/PastEvent").then(
    (module) => module.PastEvent,
  ),
);
const Tickets = dynamic(() =>
  import("@/components/devfest-triangulo-2025/Tickets").then(
    (module) => module.Tickets,
  ),
);
const Speakers = dynamic(() =>
  import("@/components/devfest-triangulo-2025/Speakers").then(
    (module) => module.Speakers,
  ),
);
const SponsorsSection = dynamic(() =>
  import("@/components/devfest-triangulo-2025/SponsorsSection").then(
    (module) => module.SponsorsSection,
  ),
);
const Faq = dynamic(() =>
  import("@/components/devfest-triangulo-2025/Faq").then(
    (module) => module.Faq,
  ),
);

interface HomePageProps {
  initialSpeakers: Array<PublicSpeakerSummary>;
  initialSponsors: Array<SponsorLevel>;
  initialTalks: Array<PublicTalkSummary>;
}

const Home = ({
  initialSpeakers,
  initialSponsors,
  initialTalks,
}: HomePageProps) => {
  return (
    <>
      <ErrorBoundary>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[2000] rounded-lg bg-devBlue-dark px-4 py-3 font-bold text-white focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Pular para o conteúdo
        </a>
        <Header />

        <main
          id="main-content"
          tabIndex={-1}
          className="overflow-x-clip bg-black text-devWhite-ice"
        >
          <HeroVideo videoId="QCYaPiFo_4k" />

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
              text: "Patrocine o DevFest Triângulo",
              href: configValues.eventLinkSponsorshipUrl,
            }}
            description=" O DevFest é um super festival de tecnologia feito por e para a
        comunidade, com o apoio do Google Developer Groups (GDG). É onde ideias
        ganham vida, conexões acontecem e o futuro da tecnologia é construído
        com colaboração, diversidade e muita energia criativa."
            subtitle="Se você ama tecnologia, adora aprender e quer fazer parte de algo
        transformador, esse evento é pra você!"
            className={homepageSectionClassName}
            id="about"
          />

          <InfiniteBanner
            direction="leftToRight"
            items={devfest2025Images1}
            speed={2000}
            className={styles.Section}
            id="gallery-2025-primary"
          />
          <InfiniteBanner
            direction="rightToLeft"
            items={devfest2025Images2}
            speed={2000}
            className={styles.Section}
            id="gallery-2025-secondary"
          />
          <CountdownTimer
            className={deferredHomepageSectionClassName}
            id="countdown"
            aria-label="Contagem regressiva para o evento"
          />

          <Presentation
            tags={[
              { text: "O maior da América Latina" },
              { text: "+ 2.000 participantes" },
              { text: "5 trilhas de conteúdo" },
              { text: "+ 20 palestras" },
              { text: "Lounge Especialistas" },
            ]}
            title={
              <>
                Como foi a <span>última edição</span>
              </>
            }
            description={`O ${configValues.lastEvent}, em Uberlândia, foi um verdadeiro marco e
          mostrou o poder da comunidade em ação:`}
            className={deferredHomepageSectionClassName}
            id="past-event"
          ></Presentation>

          <PastEvent className={deferredHomepageSectionClassName} />

          <Presentation
            title={
              <>
                <span>Garanta a sua vaga</span> no DevFest
              </>
            }
            subtitle="O maior DevFest da América Latina está chegando, e o melhor é que você
        pode fazer parte disso tudo. Aprendizado, conexão, experiências únicas e
        muita inovação te esperam."
            className={deferredHomepageSectionClassName}
            id="registration"
          ></Presentation>

          <div className={deferredHomepageSectionClassName}>
            <Tickets />
          </div>

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
            id="ticket-benefits"
          />

          <Speakers
            speakers={initialSpeakers}
            talks={initialTalks}
            className={deferredHomepageSectionClassName}
          />

          <InfiniteBanner
            direction="rightToLeft"
            items={devfest2023Images}
            speed={2000}
            className={styles.Section}
            id="gallery-2023"
          />

          <InfiniteBanner
            direction="leftToRight"
            items={devfest2024Images}
            speed={2000}
            className={styles.Section}
            id="gallery-2024"
          />

          <SponsorsSection
            className={deferredHomepageSectionClassName}
            sponsors={initialSponsors}
            id="sponsors"
          />

          {/* <EventLocation className={styles.Section} id="place" /> */}

          <Faq className={deferredHomepageSectionClassName} id="faq" />
        </main>
      </ErrorBoundary>
    </>
  );
};

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  try {
    const [speakers, sponsors, talks] = await Promise.all([
      getAllSpeakers(),
      getAllSponsorLevels(),
      getAllTalks(),
    ]);

    const publicSpeakers = speakers.filter((speaker) => speaker.isVisible);
    const visibleSpeakerIds = new Set(
      publicSpeakers.map((speaker) => speaker.id),
    );
    const publicTalks = talks.filter(
      (talk) =>
        talk.isActive &&
        talk.speakerIds.some((speakerId) => visibleSpeakerIds.has(speakerId)),
    );

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600",
    );

    return {
      props: {
        initialSpeakers: publicSpeakers.map(
          ({ id, name, company, title, photoUrl }) => ({
            id,
            name,
            company,
            title,
            photoUrl,
          }),
        ),
        initialSponsors: sponsors,
        initialTalks: publicTalks.map(({ id, title, speakerIds }) => ({
          id,
          title,
          speakerIds,
        })),
      },
    };
  } catch (error) {
    console.error("Erro ao ler props iniciais:", error);
    res.setHeader("Cache-Control", "no-store");
    return {
      props: {
        initialSpeakers: [],
        initialSponsors: [],
        initialTalks: [],
      },
    };
  }
}

Home.layout = BaseLayout;

export default Home;
