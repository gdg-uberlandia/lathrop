import { Speaker } from "models/speaker";
import { Swiper as SwiperType } from 'swiper';

import React, { useRef, useState } from "react";
import styles from "./SpeakerSection.module.css";
import SpeakerCard from "./speaker-card";
import { Col, Container, Row } from "reactstrap";
import { Carousel } from "components/carousel";
import { Navigation } from 'swiper/modules';
import clsx from "clsx";
import Image from "next/image";
import SpeakerModal from "./speaker-modal";
interface SpeakersSectionProps {
  speakers: Array<Speaker>,
}

type colorTypes = 'primary' | 'secondary' | 'tertiary';

const SpeakerSection = ({ speakers }: SpeakersSectionProps) => {
  const swiperRef = useRef<SwiperType>();

  const [speakerSelected, setSpeakerSelected] = useState<Speaker | undefined>(undefined)

  const resolveColor = (i: number) => {
    const resolve = i % 3;
    const value = { 0: 'primary', 1: 'secondary', 2: 'tertiary' }[resolve]
    return value ?? 'primary';
  }

  return (
    <section className={styles.Wrapper}>
      <Container className={styles.Container}>
        <Row tag="header" className={styles.Header}>
          <Col sm={12} xxl={3} tag="h2">
            <span className={styles.Title}>
              Palestrantes
            </span>
          </Col>
          <Col tag="p" className={styles.HeaderText}>
            No <strong>IWD Uberlândia 2024</strong>, teremos um time poderoso de palestrantes, composto por mulheres! Essas mulheres são destaque em diferentes áreas, e nosso objetivo vai além de estimular a comunidade tecnológica, abrangendo interação, conexão e Containerersidade.
          </Col>
        </Row>
        <Row tag="section" className={styles.Content}>
          <Carousel.Container
            loop={speakers?.length > 3}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1240: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            modules={[Navigation]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            className={styles.SpeakersCarousel}
          >
            {speakers.map((speaker, i) =>
              <Carousel.Item
                key={speaker.id}
                className={styles.CustomSwiperSlide}
              >
                {({ isActive, isNext }) =>
                  <SpeakerCard
                    key={speaker?.slug}
                    speaker={speaker}
                    color={
                      resolveColor(i)
                    }
                    active={isNext}
                    onSelectSpeaker={() => setSpeakerSelected(speaker)}
                  />
                }
              </Carousel.Item>
            )}
          </Carousel.Container>

          <button
            aria-label="Ver palestrantes anteriores"
            className={clsx(styles.SpeakersCarouselControl, styles.SpeakersCarouselControlPrevious)}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <Image alt="Ver palestrantes anteriores" src='/icons/arrow-back.svg' width={12} height={20} />
          </button>

          <button
            aria-label="Ver próximos palestrantes"
            className={clsx(styles.SpeakersCarouselControl, styles.SpeakersCarouselControlForward)}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <Image alt="Ver próximos palestrantes" src='/icons/arrow-forward.svg' width={12} height={20} />
          </button>
        </Row>

        <section
          className={styles.IllustrationSection}
        />
      </Container>

      {speakerSelected &&
        <SpeakerModal
          speaker={speakerSelected}
          modalOpen
          modalToggle={() => setSpeakerSelected(undefined)}
        />
      }
    </section>
  );
};
export default SpeakerSection;
