import React from "react";

import styles from "./Tag.module.css";

interface TagProps {
  children: React.ReactElement;
}

export const Tag = ({ children }: TagProps) => {
  return (
    <div className={styles.TagWrapper}>
      <div className={styles.TagInner}>{children}</div>
      <div className={styles.TagBorder}></div>
    </div>
  );
};
