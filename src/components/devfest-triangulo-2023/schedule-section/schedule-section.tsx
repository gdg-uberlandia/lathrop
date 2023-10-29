import React from "react";
import {
  Col,
  Container,
  Row
} from "reactstrap";
import ScheduleCard from "./schedule-card"
import ScheduleTime from "./schedule-time"
import { Speaker } from "models/speaker";

import { Schedule } from "models/schedule";
import styles from "./Schedule.module.css";

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
                <Row tag="section" key={`schedule-${index}`} className={styles.row_content}>
                  <ScheduleTime initialTime={schedule.start} endTime={schedule.end} />
                  <Col xxl={11} sm={12}>
                    <Row className={styles.schedule_grid}>
                      {schedule.speeches?.map(({ path, speakerSlug, topic }) => {
                          const speaker = speakers.find(speakerObj => speakerObj.key === speakerSlug);
                          return (
                            <ScheduleCard 
                              key={`speech-${schedule.start}-${schedule.end}-${speaker?.key}`} 
                              lgValue={Math.floor(12 / schedule.speeches.length)} 
                              path={path}
                              {...speaker} 
                            />
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