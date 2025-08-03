import styles from "./Tag.module.css";

interface TagProps {
  text: string;
}

export const Tag = ({ text }: TagProps) => {
  return (
    <div className={styles.TagWrapper}>
      <div className={styles.TagInner}>{text}</div>
      <div className={styles.TagBorder}></div>
    </div>
  );
};
