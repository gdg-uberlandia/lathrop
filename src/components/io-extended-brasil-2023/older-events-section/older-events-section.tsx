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
                        <h1 className={styles.Title}> O que é o Google IO Extended? </h1>

                        <p className={styles.Description}>

                            O que é o Google I/O Extended? 🤔

                            <br /><br />
                            No dia 10 de maio de 2023 tivemos em São Francisco na Califórnia o Google I/O. A conferência é realizada pela Google com o objetivo de mostrar as novidades da empresa para o ano corrente e em 2023 ela foi fechada para convidados.
                            <br /><br />
                            Em 24 de maio, rolou o Google I/O Connect em Miami. O evento foi idealizado para organizadores da comunidade Google Developers Group, Google Developers Expert e embaixadoras Women Techmakers.
                            O Google I/O Extended é o compartilhamento de conhecimentos adquiridos nos eventos citados acima para a comunidade local.
                            <br /><br />
                            Neste ano, GDGs de todas as regiões do país, se reuniram para trazer muito conteúdo, de forma gratuita, online e acessível para todas as pessoas.
                            Vai perder essa oportunidade de ficar por dentro de novas tecnologias Google? Nos acompanhe nas redes sociais para saber cada detalhe desse evento incrível.
                            <br />
                            #googleio #googleioextended #Google #gdg #wtm #eventoonline"
                        </p>
                    </Col>
                    <Col lg={3} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>

                        <img
                            src={'/io-sticker.png'}

                            className={styles.SupportImage}
                        />

                    </Col>
                </Row>

            </Container>

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

