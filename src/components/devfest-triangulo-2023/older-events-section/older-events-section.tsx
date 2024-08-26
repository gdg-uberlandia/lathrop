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
                        <h1 className={styles.Title}>  O que é o Devfest? </h1>

                        <p className={styles.Description}>

                            O que é o Devfest? 🤔

                            O DevFest é uma conferência global de tecnologia organizada para a comunidade pelo Google Developer Groups (GDG).
                            <br /><br />
                            O evento busca atender aos interesses e às necessidades de aprendizado da comunidade de desenvolvedores locais nas mais diversas áreas de atuação.
                            <br /><br />
                            Em 2023 nossa edição em Uberlândia recebeu:
                        </p>
                        <ul className={styles.List}>
                            <li>+950 participantes</li>
                            <li>35 horas de conteúdo</li>
                            <li>4 trilhas simultâneas</li>
                            <li>29 palestrantes</li>
                            <li>20 crianças na área kids</li>
                            <li>participantes de 7 estados do Brasil</li>

                        </ul>
                        <p className={styles.Description}>
                            além de ter 50% de palestrantes mulheres, oficina de programação para crianças, estandes de empresas e dinâmicas que proporcionaram maior network e premiação aos participantes.
                            <br /><br />
                            <b>#devfesttriangulo #devfestriangulo2024 #Google #gdg #wtm</b>
                        </p>
                    </Col>
                    <Col lg={4} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


                        <img height="300px" src="sticker-black.gif" alt='Animações com a logo do DevFest Triangulo, alguns traços e desenhos na cor amarela aparecendo gradativamente na tela'></img>
                    </Col>

                </Row>
                <Row>

                </Row>

            </Container>
            <Row noGutters={true}><iframe height="615" src="https://www.youtube.com/embed/Ov09g9WmFcE?si=dLtCtu7tJHmGeNRK" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;fullscreen"></iframe></Row>



            <div className={styles.MarqueeOuter}>
                <div className={styles.MarqueeInner}>
                    <div className={styles.ConstructItems}>
                        <div className={styles.ConstructItem}>Inteligência Artificial</div>
                        <div className={styles.ConstructItem}>Google Cloud</div>
                        <div className={styles.ConstructItem}>Android</div>
                        <div className={styles.ConstructItem}>Bard</div>
                        <div className={styles.ConstructItem}>Google Assistente</div>
                        <div className={styles.ConstructItem}>Flutter</div>
                        <div className={styles.ConstructItem}>ARcore</div>
                        <div className={styles.ConstructItem}>ChromeOS</div>
                        <div className={styles.ConstructItem}>Firebase</div>
                        <div className={styles.ConstructItem}>Material Design</div>
                        <div className={styles.ConstructItem}>Google Wallet</div>
                        <div className={styles.ConstructItem}>Google Assistente</div>
                        <div className={styles.ConstructItem}>Flutter</div>
                        <div className={styles.ConstructItem}>Angular</div>
                        <div className={styles.ConstructItem}>Inteligência Artificial</div>
                        <div className={styles.ConstructItem}>Google Cloud</div>
                        <div className={styles.ConstructItem}>Android</div>
                        <div className={styles.ConstructItem}>Bard</div>
                        <div className={styles.ConstructItem}>Google Assistente</div>
                        <div className={styles.ConstructItem}>Flutter</div>
                        <div className={styles.ConstructItem}>ARcore</div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default OlderEvenstsSection;

