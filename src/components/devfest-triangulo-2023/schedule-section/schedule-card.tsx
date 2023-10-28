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

const pathHtml = (name: string, path: string, pathStyle: string) => {
    return <div className={`${styles.path_div} ${pathStyle}`}>
        <Image
            className={styles.card_path_icon}
            src={path}
            height={15}
            width={15}
            alt={name}
        />
        <span className={styles.margin_left_10}>{name}</span>
    </div>
}

const renderPath = (path: string) => {
    switch (path) {
        case "canastra":
            return pathHtml("Trilha Queijo Canastra", `/${path}.png`, styles.path_canastra_color);
        case "minas":
            return pathHtml("Trilha Queijo Minas", `/${path}.png`, styles.path_minas_color);
        case "brain":
            return pathHtml("Trilha Brain", `/${path}.png`, styles.path_brain_color);
        default:
            return pathHtml("Trilha Queijo Curado", `/${path}.png`, styles.path_curado_color);
    }
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
        <Col xxl={props.lgValue} sm={12} className={styles.card_text}>
            <Row className={styles.card_content}>
                <Row className={styles.card_title}>
                    <div>
                        <span className={styles.margin_right_15}>{props.topic}</span>
                        {props.tech && 
                            <span>
                                <Badge color={getPillColor(props.tech)} pill>
                                    {props.tech}
                                </Badge>
                            </span>
                        }
                    </div>

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
                                <p className={styles.font_size_14}>{`${props.title} ${props.company ? "@" + props.company : ""}`}</p>
                            </div>
                        </div>
                    </Row>
                )}
            </Row>
        </Col>
    );
};

export default ScheduleCard;
