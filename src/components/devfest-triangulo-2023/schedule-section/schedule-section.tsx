import React from "react";
import {
  Col,
  Container,
  Row
} from "reactstrap";
import ScheduleCard from "./schedule-card"
import ScheduleTime from "./schedule-time"
import { Speaker } from "models/speaker";

import { Schedule, Speeches, SpeechesPath } from "models/schedule";
import styles from "./Schedule.module.css";

interface SpeakersSectionProps {
  speakers: Array<Speaker>,
  schedule: Array<Schedule>
}

function generateKey(speech: Speeches) {
  return `speech-${speech.path}-${speech.start}-${speech.end}`;
}

const getSpeakers = (speech: Speeches, speakersMap: any) => {

  if (speech.speakerKey) {
    return [speech.speakerKey];
  }

  if ('speakerKeys' in speech) {
    return speech.speakerKeys.map((speakerKey) => speakersMap.get(speakerKey));
  }

  return [];
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
                      {commonSpeeches.map((speeches) => (
                        <ScheduleCard
                          key={generateKey(speeches)}
                          speech={speeches}
                          speakers={getSpeakers(speeches, speakersMap)}

                        />
                      ))}
                    </section>
                  )}
                  {speedSpeeches.length > 0 && (
                    <section className={styles.schedule_grid}>
                      {speedSpeeches.map((speeches, i) => (
                        <ScheduleCard
                          key={generateKey(speeches)}
                          speech={speeches}
                          speakers={getSpeakers(speeches, speakersMap)}
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