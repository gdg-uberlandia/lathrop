import { Speaker, SpeakerTech } from "models/speaker";
import Image from "next/image";
import React from "react";
import { Badge, Row } from "reactstrap";

import styles from "./Schedule.module.css";
import { Speeches, SpeechesPath } from "models/schedule";
import clsx from "clsx";

type ScheduleCardProps = {
    speakers: Array<Speaker>;
    speech: Speeches;    
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

const ScheduleCardChooser = (props: ScheduleCardProps) => {
    return props.speakers.length > 0 ? <SpeakerScheduleCard {...props} /> : <RegularScheduleCard {...props} />;
};

const SpeakerScheduleCard = ({ speech, speakers }: ScheduleCardProps) => {
    const speakerInfo = speakers.find(({ tech }) => tech);

    return (
        <article className={clsx(styles.card_container, styles.common_speeches)}>
            <div className={clsx(styles.card_content, getPathColor(speech.path))}>
                <header className={styles.card_header}>
                    <h3 className={styles.card_topic}>{speakerInfo?.topic}</h3>
                    <span className={styles.speeches_infos}>
                        {speakerInfo?.tech && 
                            <Badge className={styles.card_badge} color={getPillColor(speakerInfo?.tech)} pill>
                                {speakerInfo?.tech}
                            </Badge>
                        }
                        <p className={styles.card_duration}>
                            {speech.start} - {speech.end}
                        </p>
                    </span>
                </header>
                <div>
                    {speakers.map(({ key, photo, name, title, company }) => (
                        <div key={key} className={styles.speaker_description}>
                            <Image
                                className={styles.card_image}
                                src={photo}
                                alt={`Foto ${name}`}
                                height={40}
                                width={40}
                                loading="lazy"
                            />
                            <div className={styles.card_speaker_info_content}>
                                <h5>{name}</h5>
                                <Row noGutters>
                                    <p className={styles.speaker_title}>
                                        {title}{' '}{company && 
                                            <strong>@{company} </strong>
                                        }
                                    </p>
                                </Row>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    )
}

const RegularScheduleCard = ({ speech }: ScheduleCardProps) => {
    return <article
        className={clsx(styles.card_container, styles.common_speeches)}
    >
        <div className={clsx(styles.card_content, getPathColor(speech!.path))}>
            <header className={styles.card_header_regular}>
                <h3 className={styles.card_topic}>{speech?.topic}</h3>
            </header>
        </div>
    </article>
}

export default ScheduleCardChooser;
