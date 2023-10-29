import React from "react";
import {
  Col
} from "reactstrap";

import styles from "./Schedule.module.css";

interface ScheduleTimeProps {
  initialTime: string;
  endTime: string;
}

const ScheduleTime: React.FC<ScheduleTimeProps> = (props) => {

  return (
    <Col xxl={1} sm={12} className={styles.time_row}>
      <span>{props.initialTime}</span>
      <span className={styles.timeSeparator}>-</span>
      <span className={styles.opacity50}>{props.endTime}</span>
    </Col>
  );
};

export default ScheduleTime;
