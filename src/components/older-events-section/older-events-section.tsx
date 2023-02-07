/*eslint-disable*/
import React, { useState } from "react";
import {
    Col,
    Container,
    Row,
} from "reactstrap";

import styles from 'styles/OlderEvents.module.css';

const OlderEvenstsSection: React.FC = ({ }) => {

    return (
        <>
            <Container id="about">
                <Row>
                    <Col lg={8} sm={12}>
                        <h1 className={styles.Title}> O que é o IWD? </h1>

                        <p className={styles.Description}>

                            Desde 2013 o programa Women Techmakers reuniu mais de 200 eventos globais em 52 países para receber a visibilidade, a comunidade e os recursos para as
                            mulheres em tecnologia em homenagem ao Dia Internacional da Mulher. Em 2021 WTMs de todo Brasil se uniram e irão realizar uma edição única deste evento, IWD Brasil 2021!
                            <br />
                            <br />
                            Este é um evento online e gratuito onde teremos 100% de palestrantes mulheres (Cis e Trans) organizadas por líderes da comunidade WTM em todo Brasil.
                            Alguns dos assuntos que serão observados são:
                            Alguns dos temas: Carreira na TI, Ciência de Dados, Mulheres na Computação, UX, Desenvolvimento pessoal,
                            Back-End, Front-End, Inteligência Artificial, Machine Learning, APIs do Google, Segurança da Informação (LGPD).
                        </p>
                    </Col>
                    <Col lg={3} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={'/dare-to-be-square-new.gif'}

                            height="400px"
                            width="400px"
                        />

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
                        <div className={styles.ConstructItem}>Dare to be first</div>
                        <div className={styles.ConstructItem}>Dare to be a dreamer</div>
                        <div className={styles.ConstructItem}>Dare to be unique</div>
                        <div className={styles.ConstructItem}>Dare to be happy</div>
                        <div className={styles.ConstructItem}>Dare to be fearless</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OlderEvenstsSection;

