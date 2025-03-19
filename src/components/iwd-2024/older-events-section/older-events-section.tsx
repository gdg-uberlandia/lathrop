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

                            O IWD (International Women's Day) é um evento anual organizado pela comunidade Women Techmakers globalmente para celebrar as conquistas das mulheres em tecnologia e conscientizar as pessoas sobre questões que afetam a igualdade de gênero na área de STEM. 
                            
                            <br/><br/><b>O tema do IWD 2025 é “Redefine Possible”! ✨</b>


                            Esse tema é mais do que uma declaração, é um convite para desafiar os limites do que a tecnologia pode alcançar e, principalmente, para reconhecer o papel transformador das mulheres na construção desse futuro.<br/><br/> 
                            O futuro da tecnologia não está predeterminado, ele está em constante evolução. O que hoje parece impossível, pode se tornar realidade amanhã!<br/><br/>
                            Com esse tema, queremos inspirar você a redefinir seu próprio futuro, a expandir suas possibilidades e a tornar sua presença no mundo da tecnologia ainda mais impactante. <br/><br/>

Juntas, podemos reinventar as possibilidades e criar um futuro mais<b> inclusivo e inovador! 💙</b>


                        </p>
                    </Col>
                    <Col lg={3} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        {/*<img
                            src={'/dare-to-be-square-new.gif'}

                            className={styles.SupportImage}
                        />*/}
                        <video width="430" autoPlay loop muted>
                            <source src={"/iwd-2025/redefine.mp4"} type="video/mp4" />
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

