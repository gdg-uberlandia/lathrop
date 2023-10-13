/*eslint-disable*/
import { Speaker } from "models/speaker";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Col,
  Container,
  Carousel,
  CarouselItem,
  CarouselControl,
} from "reactstrap";

import styles from "./styles/Speakers.module.css";
import SpeakerCard from "./speaker-card";
import configValues from "helpers/config";

interface SpeakersSectionProps {
  speakers: Array<Speaker>;
}

const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobile, setMobile] = useState<boolean>(true)
  const speakersChunk = (array: Array<Speaker>, size: number) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  useEffect(() => {
    const updateMobile = () => {
      if (typeof window !== undefined)
        setMobile(window.innerWidth < 576 ? true : false)
    }

    updateMobile()
    window.addEventListener('resize', updateMobile)
    return () => {
      window.removeEventListener('resize', updateMobile)
    }
  }, [])



  let _chunckSize = 1;
  if (mobile) {
    _chunckSize = 3
  }

  const _speakersChuncked = speakersChunk(speakers, _chunckSize);

  const next = () => {
    const nextIndex =
      activeIndex === _speakersChuncked.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    const nextIndex =
      activeIndex === 0 ? _speakersChuncked.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  const displaySpeakers = _speakersChuncked.map(
    (speakersList: Array<Speaker>, index: number) => {
      return (
        <CarouselItem key={`${index}-carousel-item`}>
          <div className={styles.carousel_inner}>
            {speakersList.map((speaker: Speaker) => {
              const _itemId: number | undefined = speaker.id;
              return (
                <Col
                  key={`${_itemId}-carousel-col`}
                  className={styles.card_container}
                >
                  <SpeakerCard {...speaker} />
                </Col>
              );
            })}
          </div>
        </CarouselItem>
      );
    }
  );

  const renderControls = () => {
    if (mobile) return <></>

    return <><div className={styles.carousel_prev}>
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
    </div>
      <div className={styles.carousel_next}>
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </div></>
  }

  const renderSpeakers = (): ReactNode => {
    return (
      <>
        <div className={styles.cards}>
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            ride="carousel"
            className={styles.carousel}
            style={{ width: "100%" }}
          >
            {displaySpeakers}
            {renderControls()}
          </Carousel>
        </div>
      </>
    );
  };

  const renderWithoutSpeakers = (): ReactNode => {
    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <b>
          Em breve novas informações sobre os palestrantes do evento acompanhe
          também no{" "}
          <a
            className={styles.speakers_link}
            target="_blank"
            href={configValues.socialMedia.instagram}
          >
            instagram{" "}
          </a>
        </b>
      </div>
    );
  };
  return (
    <>
      <Container>
        <div id="speakers" className={styles.container}>
          <h1>Palestrantes</h1>
          <p>
            O time de palestrantes do {configValues.name} traz grandes nomes da
            área técnica e referências em liderança de comunidades. Reunimos em
            um só evento Google Developer Experts (GDEs), Tech Leads, pessoas
            desenvolvedoras e principalmente pessoas resolvedoras de problemas.
            Esse é um evento que visa fomentar a comunidade de tecnologia, indo
            além de conhecimento técnico, contando com muita interatividade,
            conexões e diversidade.
          </p>

          {speakers.length > 0 ? renderSpeakers() : renderWithoutSpeakers()}
        </div>
      </Container>
    </>
  );
};

export default SpeakersSection;
