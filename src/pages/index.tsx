import React from "react";
import BaseLayout from "../layouts/base-layout";
import { Speaker } from "models/speaker";
import { Schedule } from "models/schedule";
import { getSponsors } from "back-features/sponsors";
import { getSpeaker } from "back-features/speakers";
import { getSchedule } from "back-features/schedule";
import { SponsorLevel } from "models/sponsor-level";
import styles from "styles/Home.module.css";
import HomeHeader from "../components/headers/home-header";
import SpeakerSection from "components/speakers-section/speakers-section";
import SponsorsSection from "components/sponsors-section/sponsors-section";
import { Countdown } from "components/devfest/2024/countdown";
import OlderEvenstsSection from "components/devfest-triangulo-2023/older-events-section/older-events-section";
import ErrorBoundary from "../components/error-boundary";
import { HeroSection } from "components/hero-section";
import { ScheduleSection } from "components/devfest-triangulo-2023/schedule-section/schedule-section";
import { EventLocationSection } from "components/devfest-triangulo-2023/event-location";
import SponsorEventSection from "components/devfest-triangulo-2023/sponsor-event-section";

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
        <HomeHeader />

        <HeroSection />

        <Countdown />

        <section className={`${styles.Section} Section`}>
          <OlderEvenstsSection />
        </section>

        <section className={`${styles.Section} Section`}>
          <SponsorEventSection />
        </section>

        <section className={`${styles.Section} Section`}>
          <SpeakerSection speakers={speakers} />
        </section>

        {/*	
        <section>
          <ScheduleSection schedule={schedule} speakers={speakers} />
        </section>

         */}

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
        schedule: [], //await getSchedule(),
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { speakers: [], sponsors: [] } };
  }
}

Home.layout = BaseLayout;

export default Home;
