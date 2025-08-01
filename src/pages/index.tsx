import { getSchedule } from "back-features/schedule";
import { getSpeaker } from "back-features/speakers";
import { getSponsors } from "back-features/sponsors";
import { EventLocationSection } from "components/devfest-triangulo-2023/event-location";
import { ScheduleSection } from "components/devfest-triangulo-2023/schedule-section/schedule-section";
import SponsorEventSection from "components/devfest-triangulo-2023/sponsor-event-section";
import { CountdownTimer } from "components/devfest-triangulo-2025/CountdownTimer";
import { Header } from "components/devfest-triangulo-2025/Header";
import { Presentation } from "components/devfest-triangulo-2025/Presentation";
import { HeroSection } from "components/hero-section";
import SpeakerSection from "components/speakers-section/speakers-section";
import SponsorsSection from "components/sponsors-section/sponsors-section";
import { Schedule } from "models/schedule";
import { Speaker } from "models/speaker";
import { SponsorLevel } from "models/sponsor-level";
import styles from "styles/Home.module.css";

import { ExtraInfo } from "@/components/devfest-triangulo-2025/ExtraInfo";
import { InfiniteBanner } from "@/components/devfest-triangulo-2025/InfiniteBanner";
import { PastEvent } from "@/components/devfest-triangulo-2025/PastEvent";

import ErrorBoundary from "../components/error-boundary";
import BaseLayout from "../layouts/base-layout";

// https://alvarotrigo.com/blog/css-animations-scroll/

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

        <HeroSection />

        <section className={`${styles.Section} Section`}>
          <Presentation />
        </section>

        <section className={`${styles.Section} Section`}>
          <CountdownTimer />
        </section>

        <section className={`${styles.Section} Section`}>
          <PastEvent />
        </section>

        <section className={`${styles.Section} Section`}>
          <ExtraInfo />
        </section>

        <section className={`${styles.Section} Section`}>
          <InfiniteBanner
            direction="leftToRight"
            items={["Os ingressos são limitados", "Garanta sua vaga"]}
            speed={70}
          />
        </section>

        <section className={`${styles.Section} Section`}>
          <SponsorEventSection />
        </section>

        <section className={`${styles.Section} Section`}>
          <SpeakerSection speakers={speakers} />
        </section>

        <section>
          <ScheduleSection schedule={schedule} speakers={speakers} />
        </section>

        <section className={`${styles.Section} Section`}>
          <SponsorsSection sponsors={sponsors} />
        </section>

        <section className={`${styles.Section} Section`}>
          <EventLocationSection />
        </section>
      </ErrorBoundary>
    </>
  );
};

export async function getServerSideProps() {
  try {
    return {
      props: {
        speakers: await getSpeaker(),
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
