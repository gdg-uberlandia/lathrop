/*eslint-disable*/
import React, { useState } from "react";
import {
    Col,
    Container,
    Row,
} from "reactstrap";

import styles from './OlderEvents.module.css';

const OlderEvenstsSection: React.FC = ({ }) => {

    return (
        <>
            <Container id="about">
                <Row>
                    <Col lg={8} sm={12}>
                        <h1 className={styles.Title}> O que é o IWD? </h1>

                        <p className={styles.Description}>

                            O IWD (International Women's Day) é um evento anual organizado pela comunidade Women Techmakers globalmente para celebrar as conquistas das mulheres em tecnologia e conscientizar as pessoas sobre questões que afetam a igualdade de gênero na área de STEM. Em 2024 o tema do IWD será: <b>"Impact the Future"!</b>
                            <br />
                            <br />
                            Todos temos o poder de impactar o futuro, e como será esse futuro? Como vamos construí-lo?
                            <br />
                            <br/>
                             Ao  celebrarmos o <b>IWD 2024</b>, encorajamos você a refletir sobre as seguintes questões: No que vocês estão trabalhando que fará a diferença no mundo? Como você está usando suas habilidades e talentos para criar um futuro melhor? Você está sonhando grande e sendo ousada para “Impactar o Futuro”?
                            <br />
                                            <br />
                            Venha participar conosco dessa celebração com <b>100% de palestrantes mulheres</b> que irão abordar diversos temáticas e ajudar a refletir ainda mais sobre como impactar o futuro!
                                                    </p>
                    </Col>
                    <Col lg={3} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        {/*<img
                            src={'/dare-to-be-square-new.gif'}

                            className={styles.SupportImage}
                        />*/}
                        <video width="430" autoPlay loop muted>
                            <source src={"/iwd-2024/impact-the-future.mp4"} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                    </Col>
                </Row>

            </Container>

            <div className={styles.MarqueeOuter}>
                <div className={styles.MarqueeInner}>
                    <div className={styles.ConstructItems}>
                        <div className={styles.ConstructItem}>Dare to be BOLD</div>
                        <div className={styles.ConstructItem}>Dare to be innovative</div>
                        <div className={styles.ConstructItem}>Dare to be resilient</div>
                        <div className={styles.ConstructItem}>Dare to be creative</div>
                        <div className={styles.ConstructItem}>Dare to be the first</div>
                        <div className={styles.ConstructItem}>Dare to be a dreamer</div>
                        <div className={styles.ConstructItem}>Dare to be unique</div>
                        <div className={styles.ConstructItem}>Dare to be happy</div>
                        <div className={styles.ConstructItem}>Dare to be fearless</div>
                        <div className={styles.ConstructItem}>Dare to be BOLD</div>
                        <div className={styles.ConstructItem}>Dare to be innovative</div>
                        <div className={styles.ConstructItem}>Dare to be resilient</div>
                        <div className={styles.ConstructItem}>Dare to be creative</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OlderEvenstsSection;

