import React, { useEffect, useState } from "react";
import BaseLayout from "../layouts/base-layout";
import { Speaker } from "models/speaker";
import { Schedule } from "models/schedule";
import { SponsorLevel } from "models/sponsor-level";

import styles from "styles/Home.module.css";
import HomeHeader from "../components/headers/iwd/home-header";
import SpeakerSection from "components/iwd-2024/speakers-section";
import SponsorsSection from "components/iwd-2024/sponsors-section/sponsors-section";
import CountdownTimer from "components/iwd-2025/countdown/countdown-timer";
import OlderEvenstsSection from "components/iwd-2024/older-events-section/older-events-section";

import { EventLocationSection } from "components/iwd-2024/event-location";
import ScheduleSection from "components/iwd-2024/schedule-section/schedule-section";

import ErrorBoundary from '../components/error-boundary';
import { HeroSection } from "components/iwd-2025/hero-section";
import { Testimonials } from "components/iwd-2024/testimonials";
import { getSponsors } from "back-features/sponsors";
import { getSpeakers } from "back-features/speakers";
import { getSchedule } from "back-features/schedule";

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
      <ErrorBoundary>

        <HomeHeader />

        <HeroSection />

        <CountdownTimer />

        {/*<CountdownTimer />*/}

        <section className={`${styles.Section} Section`}>
          <OlderEvenstsSection />
        </section>

        {/*<SpeakerSection speakers={speakers} />

        <Testimonials />

        <section className={`${styles.Section} Section`}>
          <ScheduleSection schedule={schedule} speakers={speakers} />
        </section>*/}

        <section className={`${styles.Section} Section`}>
          <EventLocationSection />
        </section>

         {/*<section className={`${styles.Section} Section`}>
          <SponsorsSection sponsors={sponsors} />
        </section>*/}

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
