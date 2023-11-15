import React from "react";
import {
  Col,
  Container,
  Row
} from "reactstrap";
import ScheduleCard from "./schedule-card"
import ScheduleTime from "./schedule-time"
import { Speaker } from "models/speaker";

import { Schedule, ScheduleSpeedSpeech, SpeechesPath } from "models/schedule";
import styles from "./Schedule.module.css";

const GRID_LAYOUTS = 12;

interface SpeakersSectionProps {
  speakers: Array<Speaker>,
  schedule: Array<Schedule>
}

export const ScheduleSection: React.FC<SpeakersSectionProps> = ({ speakers, schedule }) => {
  const speakersMap = new Map(speakers.map((speaker) => ([speaker.key, speaker])));

  return (
    <>
      {speakers.length &&
        <Container>
          <div id="schedule">
            <h2 className="gdg-line">Agenda</h2>
          </div>
          {schedule.map((schedule, index) => {
            const commonSpeeches = schedule.speeches.filter((speeches) => speeches.path !== SpeechesPath.COMUNIDADE);
            const speedSpeeches = schedule.speeches.filter((speeches) => speeches.path === SpeechesPath.COMUNIDADE);

            return (
              <Row tag="section" key={`schedule-${index}`} className={styles.row_content}>
                <ScheduleTime initialTime={schedule.start} endTime={schedule.end} />
                <Col sm={12}>
                  {commonSpeeches.length && (
                    <section className={styles.schedule_grid}>
                      {commonSpeeches.map((speech) => {
                        const speaker = speakersMap.get(speech.speakerSlug)
                        return speaker ? <ScheduleCard
                          key={`speech-${speech.path}-${speech.speakerSlug}`}
                          speech={speech}
                          speaker={speaker}
                          start={schedule.start}
                        /> : <ScheduleCard
                          key={`speech-${speech.path}-${speech.topic}`}
                          speech={speech}
                          start={schedule.start}
                        />
                      }
                      )}
                    </section>
                  )}
                  {speedSpeeches.length > 0 && (
                    <section className={styles.schedule_grid}>
                      {speedSpeeches.map((speech) => (
                        <ScheduleCard
                          key={`speech-${speech.path}-${speech.speakerSlug}`}
                          speech={speech}
                          speaker={speakersMap.get(speech.speakerSlug)!}
                          start={schedule.start}
                        />
                      ))}
                    </section>
                  )}
                </Col>
              </Row>
            )
          })}
        </Container>
      }
    </>
  );
};