import React from "react";
import BaseLayout from '../layouts/base-layout';
import { Col, Row, Container } from 'reactstrap';
import styles from '../styles/Speakers.module.css'
import SpeakerCard from 'components/speakers-section/speaker-card';
import { Speaker } from 'models/speaker';
import { getSpeakers } from "front-features/speakers";
import configValues from "helpers/config";
import HomeHeader from "components/headers/home-header";


interface SpeakersPageProps {
    speakers: Array<Speaker>
}

const SpeakersPage = ({ speakers }: SpeakersPageProps) => {

    const sectionStyle = {
        marginTop: '60px'
    }

    const _center = {
        justifyContent: 'center',
    }

    const constructSpeakerCol = (_speaker: Speaker) => {
        return (
            <Col lg="4" style={{ margin: "20px 20px" }} key={_speaker.id} className={styles.card_container}>
                <SpeakerCard
                    {..._speaker}
                />
            </Col>);
    }

    return (
        <>

            <HomeHeader isRoot={false} />
            <div style={{ margin: "60px 60px" }}>
                <Container >
                    <h1>Palestrantes</h1>

                    <p style={{ marginTop: '60px' }}>
                        As pessoas palestrantes do {configValues.name} possuem uma variedade de experiências, que vão desde pessoas desenvolvedoras experientes à lideres de comunidades. As pessoas que palestram com frenquência se engajam em conversas técnicas em suas empresas, cidades e países. No Devfest você pode esperar palestras de Google Developer Experts, Tech Leads, pessoas desenvolvedoras e resolvedores de problemas.
                    </p>
                    <section style={sectionStyle}>
                        <Row style={_center}>

                            {speakers.map((speaker) => constructSpeakerCol(speaker))}
                        </Row>
                    </section>
                </Container>
                <Container fluid>
                    <Row style={{ ..._center, textAlign: 'center', marginTop: '20px' }}>
                        <h4> Mais palestrantes a confirmar ...</h4>

                    </Row>
                </Container>
            </div>
        </>
    )
}


export async function getServerSideProps() {
    try {
        return {
            props: {
                speakers: await getSpeakers(),
            }
        }
    } catch (error) {
        console.error(error)
        return ({ props: { speakers: [] } });
    }

}


SpeakersPage.layout = BaseLayout;



export default SpeakersPage
