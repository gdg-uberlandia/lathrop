import React from "react";
import {
  Col,
  Container,
  Row
} from "reactstrap";
import ScheduleCard from "./schedule-card"
import ScheduleTime from "./schedule-time"
import { Speaker } from "models/speaker";

import styles from "./Schedule.module.css";
import { Schedule } from "models/schedule";

interface SpeakersSectionProps {
  speakers: Array<Speaker>,
  schedule: Array<Schedule>
}

export const ScheduleSection: React.FC<SpeakersSectionProps> = ({ speakers, schedule }) => {
  return (
    <>
      {speakers.length &&
        <Container>
          <div id="schedule">
            <h4>Agenda</h4>
          </div>
          {schedule.map((schedule, index) => {
              return (
                <Row key={`schedule-${index}`} className={styles.row_content}>
                  <ScheduleTime initialTime={schedule.start} endTime={schedule.end} />
                  <Col xxl={11} sm={12}>
                    <Row className={styles.height100p}>
                      {schedule.speeches?.map((speech, index) => {
                          const speaker = speakers.find(speakerObj => speakerObj.key === speech.speakerSlug);

                          return (
                            <ScheduleCard key={`speech-${schedule.start}-${schedule.end}-${index}`} lgValue={12 / schedule.speeches.length} {...speaker} />
                          )
                      })}
                    </Row>
                  </Col>
                </Row>
              )
          })}
        </Container>
      }
    </>
  );
};