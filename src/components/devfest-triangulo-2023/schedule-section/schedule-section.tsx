import React from "react";
import {
  Col,
  Container,
  Row
} from "reactstrap";
import ScheduleCard from "./schedule-card"
import ScheduleTime from "./schedule-time"
import { Speaker } from "models/speaker";

import { Schedule, ScheduleSpeedSpeeches, SpeechesPath } from "models/schedule";
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
            <h4>Agenda</h4>
          </div>
          {schedule.map((schedule, index) => {
              const commonSpeeches = schedule.speeches.filter((speeches) => speeches.path !== SpeechesPath.SPEED); 
              const speedSpeeches = schedule.speeches.filter((speeches) => speeches.path === SpeechesPath.SPEED); 
              console.log("speedSpeeches ", speedSpeeches.length)
              const startTimeGenerator = () => {
                let start = schedule.start;

                return (duration: number) => {
                  const _temp = start;
                  const [hour, minute] = start.split(':');
                  start = `${hour}:${Number(minute) + duration}`;
                  return _temp;
                }
              }

              const generateStarTime = startTimeGenerator()

              return (
                <Row tag="section" key={`schedule-${index}`} className={styles.row_content}>
                  <ScheduleTime initialTime={schedule.start} endTime={schedule.end} />
                  <Col sm={12}>
                    {commonSpeeches.length && (
                      <Row>
                        {commonSpeeches.map((speeches) => (
                          <ScheduleCard 
                            key={`speech-${speeches.path}-${speeches.speakerSlug}`} 
                            speeches={speeches}
                            speaker={speakersMap.get(speeches.speakerSlug)!}
                            lgValue={GRID_LAYOUTS / commonSpeeches.length}
                          />
                        ))}
                      </Row>
                    )}
                    {speedSpeeches.length > 0 && (
                      <Row>
                        {speedSpeeches.map((speeches) => (
                          <ScheduleCard 
                            key={`speech-${speeches.path}-${speeches.speakerSlug}`} 
                            speeches={speeches}
                            speaker={speakersMap.get(speeches.speakerSlug)!}
                            start={generateStarTime((speeches as ScheduleSpeedSpeeches).duration)}
                            lgValue={GRID_LAYOUTS / speedSpeeches.length}
                          />
                        ))}
                      </Row>
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