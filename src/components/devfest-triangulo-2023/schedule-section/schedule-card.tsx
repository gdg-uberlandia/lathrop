import { Speaker, SpeakerTech } from "models/speaker";
import Image from "next/image";
import React from "react";
import { Badge, Col } from "reactstrap";

import styles from "./Schedule.module.css";
import { ScheduleSpeeches, ScheduleSpeedSpeeches,  SpeechesPath } from "models/schedule";
import clsx from "clsx";

type ScheduleCardProps = {
    speaker: Speaker;
    speeches: ScheduleSpeeches;
} | {
    speaker: Speaker;
    speeches: ScheduleSpeedSpeeches;
    start: string;
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

const getPathColor = (path: SpeechesPath) => {
    switch (path) {
        case SpeechesPath.ONE:
            return styles.path_one_color
        case SpeechesPath.TWO:
            return styles.path_two_color
        case SpeechesPath.THREE:
            return styles.path_three_color
        case SpeechesPath.SPEED:
            return styles.path_SPEED_color
    }
}

const ScheduleCard = ({ speeches, speaker, ...rest }: ScheduleCardProps) => {
    const speedSpeeches = 'start' in rest && 'duration' in speeches;
    const [startHour, startMinute] = speedSpeeches ? rest.start.split(':') : []

    return (
        <Col className={clsx(
            styles.card_container,
            speedSpeeches 
                ? styles['speed-speeches']
                : styles['common-speeches']
        )}>
            <div className={clsx(styles.card_content, getPathColor(speeches.path))}>
                <header className={styles.card_header}>
                    <h3 className={styles.card_topic}>{speaker.topic}</h3>
                    {speaker.tech && 
                        <Badge className={styles.card_badge} color={getPillColor(speaker.tech)} pill>
                            {speaker.tech}
                        </Badge>
                    }
                    {speedSpeeches && 
                        <p className={styles.card_duration}>
                            {rest.start} - {startHour}:{Number(startMinute) + speeches.duration} 
                        </p>
                    }
                </header>
                {speaker.photo && (
                    <div className={styles.speaker_description}>
                        <Image
                            className={styles.card_image}
                            src={speaker.photo}
                            alt={`Foto ${speaker.name}`}
                            height={40}
                            width={40}
                            loading="lazy"
                        />
                        <div className={styles.card_speaker_info_content}>
                            <h5>{speaker.name}</h5>
                            <p>
                                {speaker.title}{' '}
                                {speaker.company && <strong>@{speaker.company} </strong>}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Col>
    );
};

export default ScheduleCard;
