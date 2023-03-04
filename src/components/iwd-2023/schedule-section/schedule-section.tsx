/*eslint-disable*/
import { Speaker } from "models/speaker";
import Image from "next/legacy/image";
import React, { useState } from "react";
import {
    Badge,
    Col,
    Row,
    Container
} from "reactstrap";
import ScheduleTime from "./schedule-time"
import { Schedule } from "models/schedule";
import styles from "./Schedule.module.css";

interface SpeakersSectionProps {
    speakers: Array<Speaker>,
    schedule: Array<Schedule>
}

const ScheduleSection: React.FC<SpeakersSectionProps> = ({ speakers, schedule }) => {
    const getPillColor = (tech: string) => {
        switch (tech) {
            case "Carreira":
                return "primary"
            case "Machine Learning":
                return "secondary"
            case "Web":
                return "danger"
            case "UI/UX":
                return "info"
            case "Infra/Devops":
                return "warning"
            default:
                return "success"
        }
    }


    return (
        <>
            <div className={styles.ScheduleSection}>
                <Container style={{
                    marginLeft
                        : '0px'
                }}>
                    <Row >
                        <Col height="10px" lg={4} sm={22} style={{ paddingLeft: '0px' }}
                        ><img style={{ marginTop: '15px' }} width="400px" src="/connector.png" />
                        </Col>

                        <Col lg={4} sm={12}><h1 style={{ paddingLeft: '10px' }}>Programação</h1></Col>
                    </Row>
                </Container>
                <div className={styles.ScheduleWrapper}>
                    {speakers.length &&
                        <div className={styles.ScheduleTable}>
                            <Row className={styles.ScheduleHeader}>
                                Cronograma 25 Março
                            </Row>
                            <Row className={styles.ScheduleBody}>
                                {
                                    schedule.map((schedule, index) => {
                                        return (
                                            <Row key={`schedule-${index}`} className={styles.ScheduleItem}>
                                                <ScheduleTime initialTime={schedule.start} />
                                                <Col xxl={11} sm={12}>
                                                    <Row >
                                                        {
                                                            schedule.speeches?.map((speech, index) => {
                                                                const speaker = speakers.find(speakerObj => speakerObj.slug === speech.speakerSlug);
                                                                console.log("speaker: " + JSON.stringify(speaker))
                                                                if (speech?.topic) {
                                                                    return <><Row>
                                                                        <Col>
                                                                            {speech.topic}
                                                                        </Col>
                                                                    </Row>
                                                                    </>
                                                                } else if (speaker) {
                                                                    return (<>
                                                                        <Col>
                                                                            <Row>
                                                                                <Col lg={10} className={styles.SpeakerTopic}>{speaker.topic}</Col>
                                                                                <Col lg={2}>
                                                                                    {speaker.tech && <span><Badge color={getPillColor(speaker.tech)} pill>{speaker.tech}</Badge></span>}
                                                                                </Col>
                                                                            </Row>
                                                                            <Row><Col>
                                                                                {speaker.name}
                                                                            </Col>
                                                                            </Row>

                                                                        </Col>
                                                                    </>
                                                                    )
                                                                } else <></>

                                                            })
                                                        }
                                                    </Row>
                                                </Col>
                                            </Row>)
                                    })
                                }</Row>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default ScheduleSection;
