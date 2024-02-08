import React from "react";
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

                            O que é o IWD?

                            Desde 2013, embaixadoras Women Techmakers ao redor de todo o mundo realizam o IWD (International Women’s Day), já são mais de 1.000 eventos em mais de 75 países celebrando as incríveis realizações das mulheres na tecnologia e atuando também como um apelo à equidade de gênero em todo o mundo.
                            O IWD é um evento que promove a troca de conhecimento, networking, mentorias e principalmente o protagonismo	da mulher em tecnologia.
                            <br />
                            Todos os anos o IWD é celebrado em torno de um tema, e em 2023 nosso tema é #DareToBe.
                            O que significa Dare To Be? Ouse ser!
                            <br />
                            A beleza de “Dare To Be” é que a frase faz parte de algo maior: você pode ousar ser ousada, ser inovadora, ser resiliente, entre tantas outras coisas.
                            Reconhecemos que cada uma de nós tem algo único para oferecer, e quando nós, como comunidade, somos capazes de aproveitar a diversidade de todas então podemos contribuir com a construção de um mundo onde todas as mulheres possam prosperar na tecnologia.
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

