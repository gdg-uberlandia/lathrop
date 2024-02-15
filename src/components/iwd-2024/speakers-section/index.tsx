import { Speaker } from "models/speaker";
import { Swiper as SwiperType } from 'swiper';

import React, { useRef } from "react";
import styles from "./SpeakerSection.module.css";
import SpeakerCard from "./speaker-card";
import { Col, Container, Row } from "reactstrap";
import { Carousel } from "components/carousel";
import { Navigation } from 'swiper/modules';
import clsx from "clsx";
import Image from "next/image";
interface SpeakersSectionProps {
  speakers: Array<Speaker>,
}

const SpeakerSection = ({ speakers }: SpeakersSectionProps) => {
  const swiperRef = useRef<SwiperType>();

  return (
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
            loop
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1440: {
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
              >
               {({ isActive, isNext }) => 
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  color={
                    isActive ? "primary" :
                    isNext ? "tertiary" :
                    "secondary"
                  }
                  active={isNext}
                />
              }
              </Carousel.Item>
            )}
          </Carousel.Container>

          <button 
            aria-label="Ver palestrantes anteriores"
            className={clsx(styles.SpeakersCarouselControl)}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <Image alt="Ver palestrantes anteriores" src='/icons/arrow-back.svg' width={20} height={20} />
          </button>

          <button 
            aria-label="Ver próximos palestrantes"
            className={clsx(styles.SpeakersCarouselControl, styles.SpeakersCarouselControlForward)}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <Image alt="Ver próximos palestrantes" src='/icons/arrow-forward.svg' width={20} height={20} />
          </button>
        </Row>
    </Container>
  );
};
export default SpeakerSection;
