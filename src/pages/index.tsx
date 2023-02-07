import React, { useEffect } from 'react';
import HomeHeader from '../components/headers/home-header';
import BaseLayout from '../layouts/base-layout';
import SpeakersSection from '../components/speakers-section/speakers-section';
import OlderEvenstsSection from 'components/older-events-section/older-events-section';
import SponsorsSection from 'components/sponsors-section/sponsors-section';
import TicketsSection from 'components/tickets-section/tickets-section';
import ScheduleSection from 'components/schedule-section/schedule-section';
import { Speaker } from 'models/speaker';
import { Schedule } from 'models/schedule';
import { getSpeakers } from 'front-features/speakers';
import { getSponsors } from 'front-features/sponsors';
import { getSchedule } from 'front-features/schedule'
import { SponsorLevel } from 'models/sponsor-level';


import styles from 'styles/Home.module.css';





// https://alvarotrigo.com/blog/css-animations-scroll/

interface HomePageProps {
  speakers: Array<Speaker>, sponsors: { [key: string]: SponsorLevel }, schedule: Array<Schedule>
}

const Home = ({ speakers, sponsors, schedule }: HomePageProps) => {

  const reveal = () => {
    var reveals = document.querySelectorAll("section");
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
  }

  useEffect(() => {
    window.addEventListener("scroll", reveal);
  })

  return (
    <>
      <div>
        <HomeHeader></HomeHeader>

        <section className={styles.Section}>
          <OlderEvenstsSection />
        </section>
        {/*<section className={styles.Section}>
          <SpeakersSection speakers={speakers} />
        </section>
        <section className={styles.Section}>
          <TicketsSection />
        </section>
        <section className={styles.Section}>
          <ScheduleSection speakers={speakers} schedule={schedule} />
  </section>*/}
        <section className={styles.Section}>
          <SponsorsSection sponsors={sponsors} />
        </section>

      </div>
    </>

  )
}

export async function getServerSideProps() {
  try {
    return {
      props: {
        speakers: await getSpeakers(),
        sponsors: await getSponsors(),
        schedule: await getSchedule()
      }
    }
  } catch (error) {
    console.error(error)
    return ({ props: { speakers: [], sponsors: [] } });
  }

}


Home.layout = BaseLayout;



export default Home
