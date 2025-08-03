import React from "react";

import styles from "./TruncatedText.module.css";

interface TruncatedTextProps {
  text: string;
  maxChars?: number;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxChars = 68,
}) => {
  const truncated =
    text.length > maxChars ? text.slice(0, maxChars).trimEnd() + "..." : text;

  return <span className={styles.TruncatedText}>{truncated}</span>;
};
