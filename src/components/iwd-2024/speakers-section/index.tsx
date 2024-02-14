import { Speaker } from "models/speaker";
import React, { useState } from "react";
import styles from "./SpeakerSection.module.css";
import SpeakerCard from "./speaker-card";
import { Carousel, CarouselControl, CarouselItem, Col, Container, Row } from "reactstrap";
import Image from "next/image";
import clsx from "clsx";

interface SpeakersSectionProps {
  speakers: Array<Speaker>,
}

const SpeakerSection = ({ speakers }: SpeakersSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === speakers.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? speakers.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };
  
  return (
    <Container className={styles.Container}>
        <Row noGutters tag="header" className={styles.Header}>
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
          <Carousel
            interval={false}
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            className={styles.SpeakersCarousel}
            cssModule={{
              'carousel-inner': styles.CarouselInner,
            }}
          >
            {speakers.map((speaker, i) => 
              <CarouselItem 
                key={speaker.id} 
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                cssModule={{
                  'carousel-item': styles.CarouselItem,
                  'active': styles.CarouselItemActive,
                }}
              >
                <SpeakerCard
                  key={speaker.slug}
                  speaker={speaker}
                  color={
                    i % 3 === 0 ? 'primary' : 
                    i % 2 === 0 ? 'secondary' : 
                    'tertiary'
                  }
                  active={i % 2 !== 0}
                />
              </CarouselItem>
            )}
            <button 
              aria-label="Ver palestrantes anteriores"
              onClick={previous}
              className={clsx(
                styles.SpeakersCarouselControl,
                styles.SpeakersCarouselControlBack
              )}
            >
              <Image alt="Ver palestrantes anteriores" src='/icons/arrow-back.svg' width={20} height={20} />
            </button>
            
            <button 
              aria-label="Ver próximos palestrantes"
              onClick={next}
              className={clsx(
                styles.SpeakersCarouselControl,
                styles.SpeakersCarouselControlForward
              )}
            >
              <Image alt="Ver próximos palestrantes" src='/icons/arrow-forward.svg' width={20} height={20} />
            </button>
          </Carousel>
        </Row>
    </Container>
  );
};
export default SpeakerSection;
