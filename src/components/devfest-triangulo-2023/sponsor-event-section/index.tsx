/*eslint-disable*/
import React, { useState } from "react";
import {
    Col,
    Container,
    Row,
} from "reactstrap";
import configValues from "helpers/config"
import ArrowIcon from '../../../../public/icons/arrow.png'
import Image from "next/image"
import styles from './styles.module.css';

const OlderEvenstsSection: React.FC = ({ }) => {

    return (
        <>
            <Container id="about" className={styles.Section}>
                <Row>
                    <Col lg={8} sm={12}>
                        <h1 className={styles.Title}> Quer ser um <span className={styles.TextMarkup}>patrocinador?</span> </h1>

                        <p className={styles.Description}>
                            Confira os benefícios de ser um patrocinador do DevFest Triângulo 2024, o maior evento de tecnologia de Uberlândia e região.
                        </p>
                    </Col>
                    <Col lg={4} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                        <a href="https://wa.me/553491846822?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%20sobre%20patroc%C3%ADnio%20do%20Devfest!" target="_blank" className={styles.SponsorButton}>
                            QUERO PATROCINAR
                        </a>
                        <Image className={styles.ArrowIcon} alt='Uma seta amarela feita em traços de giz apontando para o canto superior esquerdo' src={ArrowIcon} height={64} width={60} objectFit="cover" />

                    </Col>

                </Row>

            </Container>
        </>
    );
}

export default OlderEvenstsSection;

