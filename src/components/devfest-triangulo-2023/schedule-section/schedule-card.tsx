import { Speaker, SpeakerTech } from "models/speaker";
import Image from "next/legacy/image";
import React, { useState } from "react";
import {
    Badge,
    Col,
    Row
} from "reactstrap";

import styles from "./Schedule.module.css";

interface ScheduleCardProps extends Partial<Speaker> {
    lgValue: number;
}

const getPillColor = (tech: SpeakerTech) => {
    switch (tech) {
        case SpeakerTech.Career:
            return "primary"
        case SpeakerTech.MachineLearning:
            return "secondary"
        case SpeakerTech.Web:
            return "danger"
        case SpeakerTech.UI_UX:
            return "info"
        case SpeakerTech.Infra_Devops:
            return "warning"
        default:
            return "success"
    }
}

const ScheduleCard: React.FC<ScheduleCardProps> = (props) => {
    return (
        <Col xl={props.lgValue} sm={12} className={styles.card_text}>
            <Row className={styles.card_content}>
                <Row className={styles.card_title}>
                    <h3 className={styles.card_topic}>{props.topic}</h3>
                    {props.tech && 
                        <Badge className={styles.card_badge} color={getPillColor(props.tech)} pill>
                            {props.tech}
                        </Badge>
                    }
                </Row>
                {props.photo && (
                    <Row className={styles.display_inline_block}>
                        <div className={styles.div_wrapper}>
                            <Image
                                className={styles.card_image}
                                src={props.photo}
                                alt={`Foto ${props.name}`}
                                height={40}
                                width={40}
                                loading="lazy"
                            />
                            <div className={styles.card_speaker_info_content}>
                                <h5>{props.name}</h5>
                                <p className={styles.font_size_14}>
                                    {props.title}{' '}
                                    {props.company && <strong>@{props.company} </strong>}
                                </p>
                            </div>
                        </div>
                    </Row>
                )}
            </Row>
        </Col>
    );
};

export default ScheduleCard;
