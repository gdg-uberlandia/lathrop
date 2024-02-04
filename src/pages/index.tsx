import React, { useEffect } from "react";
import BaseLayout from "../layouts/base-layout";
import { Speaker } from "models/speaker";
import { Schedule } from "models/schedule";
import { getSponsors } from 'back-features/sponsors';
import { getSpeaker } from 'back-features/speakers';
import { SponsorLevel } from "models/sponsor-level";

import styles from "styles/Home.module.css";
import HomeHeader from "../components/headers/iwd/home-header";
import SpeakerSection from "components/iwd-2023/speakers-section/speakers-section";
import SponsorsSection from "components/sponsors-section/sponsors-section";
import CountdownTimer from "components/iwd-2023/countdown/countdown-timer";
import OlderEvenstsSection from "components/iwd-2023/older-events-section/older-events-section";


import ErrorBoundary from '../components/error-boundary';
import { HeroSection } from "components/hero-section/iwd-2024";
import { EventLocationSection } from "components/devfest-triangulo-2023/event-location";

// https://alvarotrigo.com/blog/css-animations-scroll/

interface HomePageProps {
  speakers: Array<Speaker>;
  sponsors: { [key: string]: SponsorLevel };
  schedule: Array<Schedule>;
}

const Home = ({ speakers, sponsors, schedule }: HomePageProps) => {
  const reveal = () => {
    var reveals = document.querySelectorAll(".Section");
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", reveal);

    return () => window.removeEventListener('scroll', reveal)
  }, []);

  return (
    <>
      {/*
    <section className={styles.Section}>
          <ScheduleSection speakers={speakers} schedule={schedule} />
        </section>
  */}
      <ErrorBoundary>
        <HomeHeader />

        <HeroSection />

        {/*<CountdownTimer />*/}

        <section className={`${styles.Section} Section`}>
          <OlderEvenstsSection />
        </section>

        <section className={`${styles.Section} Section`}>
          <h2>Testimonials</h2>
        </section>
        {/* <section className={`${styles.Section} Section`}>
          <SpeakerSection speakers={speakers} />
        </section>
        

        <section className={`${styles.Section} Section`}>
          <SponsorsSection sponsors={sponsors} />
        </section>
        */}

        {/*<section className={`${styles.Section} Section`}>
          <EventLocationSection />
        </section>
      */}
      </ErrorBoundary>
    </>
  );
};

export async function getServerSideProps() {
  try {
    return {
      props: {
        speakers: [],// await getSpeaker(),
        sponsors: [], //await getSponsors(),
        schedule: [],//await getSchedule(),
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { speakers: [], sponsors: [] } };
  }
}


Home.layout = BaseLayout;

export default Home;
