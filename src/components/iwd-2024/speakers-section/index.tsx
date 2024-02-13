import { Speaker } from "models/speaker";
import React from "react";
import styles from "./SpeakerSection.module.css";
import SpeakerCard from "./speaker-card";
import { Col, Container, Row } from "reactstrap";

interface SpeakersSectionProps {
  speakers: Array<Speaker>,
}

const SpeakerSection = ({ speakers }: SpeakersSectionProps) => {
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
        <Row tag="section">
          {speakers.map((speaker) => 
            <SpeakerCard
              key={speaker.slug}
              speaker={speaker}
            />
          )}
        </Row>
    </Container>
  );
};
export default SpeakerSection;
