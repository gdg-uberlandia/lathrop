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
                return "blue2"
            case "Machine Learning":
                return "secondary"
            case "Web":
                return "danger"
            case "UX/UI":
                return "info"
            case "Back-end":
                return "warning"
            case "Qualidade de Software":
                return "soft-blue";
            case "Android":
                return "soft-green";
            default:
                return "success"
        }
    }


    return (
        <>
            <div className={styles.ScheduleSection}>
                <Container>
                    <Row tag="header" className={styles.ScheduleHeaderTitle}>
                        <h2>Programação</h2>
                    </Row>
                </Container>
                <div className={styles.ScheduleWrapper}>
                    {speakers.length &&
                        <div className={styles.ScheduleTable}>
                            <Row className={styles.ScheduleHeader}>
                                Cronograma 06 Abril
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
                                                                const speaker = speech.speakerKey ? speakers.find(speakerObj => {
                                                                    return speakerObj.key == speech.speakerKey
                                                                }) : null;
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
