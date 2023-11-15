import { Speaker, SpeakerTech } from "models/speaker";
import Image from "next/image";
import React from "react";
import { Badge, Row } from "reactstrap";

import styles from "./Schedule.module.css";
import { Speeches, SpeechesPath } from "models/schedule";
import clsx from "clsx";

type ScheduleCardProps = {
    speaker?: Speaker;
    speech: { topic: string, duration: number, path: SpeechesPath };
    start?: string;
}

const DEFAULT_DURATION = 40

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
        case SpeechesPath.MINAS:
            return styles.path_one_color
        case SpeechesPath.CURADO:
            return styles.path_two_color
        case SpeechesPath.CANASTRA:
            return styles.path_three_color
        case SpeechesPath.COMUNIDADE:
            return styles.path_SPEED_color
    }
}

const formatDate = (str: number) => {
    const hours = new Date(str).getHours()
    const minutes = new Date(str).getMinutes()

    return `${hours}:${minutes.toString().padStart(2, '0')}`
}

const ScheduleCard = ({ speaker, start, speech }: ScheduleCardProps) => {
    const speedSpeeches = speech?.duration != null && speech?.duration < 30;
    const [startHour, startMinute] = start?.split(':') ?? [];
    const startDate = new Date(0, 0, 0, Number(startHour), Number(startMinute), 0)


    const renderRegularBlock = () => {
        return <article
            className={clsx(
                styles.card_container,
                styles['common-speeches']
            )}
        >
            <div className={clsx(styles.card_content, getPathColor(speech!.path))}>
                <header className={styles.card_header_regular}>
                    <h3 className={styles.card_topic}>{speech?.topic}</h3>
                </header>
            </div>
        </article>
    }

    const renderSpeaker = () => {
        return <article
            className={clsx(
                styles.card_container,
                speedSpeeches
                    ? styles['speed-speeches']
                    : styles['common-speeches']
            )}
        >
            <div className={clsx(styles.card_content, getPathColor(speech!.path))}>
                <header className={styles.card_header}>
                    <h3 className={styles.card_topic}>{speaker!.topic}</h3>
                    <span className={styles.speeches_infos}>
                        {speaker!.tech &&
                            <Badge className={styles.card_badge} color={getPillColor(speaker!.tech)} pill>
                                {speaker!.tech}
                            </Badge>
                        }
                        <p className={styles.card_duration}>
                            {start} - {formatDate(startDate.setMinutes(startDate.getMinutes() + speech!.duration))}
                        </p>
                    </span>
                </header>
                {speaker!.photo && (
                    <div className={styles.speaker_description}>
                        <Image
                            className={styles.card_image}
                            src={speaker!.photo}
                            alt={`Foto ${speaker!.name}`}
                            height={40}
                            width={40}
                            loading="lazy"
                        />
                        <div className={styles.card_speaker_info_content}>
                            <h5>{speaker!.name}</h5>
                            <Row noGutters>
                                <p className={styles.speaker_title}>
                                    {speaker!.title}{' '}
                                </p>
                                <p>
                                    {speaker!.company && <strong>@{speaker!.company} </strong>}
                                </p>
                            </Row>
                        </div>
                    </div>
                )}
            </div>
        </article>
    }

    const conditionalRender = () => {
        if (speaker) {
            return renderSpeaker();
        }
        else if (speech) {
            return renderRegularBlock();
        }
    }

    return (
        <>
            {conditionalRender()}
        </>

    );
};

export default ScheduleCard;
