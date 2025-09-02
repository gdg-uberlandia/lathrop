import { useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

interface FaqItemProps {
  title: string;
  content: React.ReactNode;
}

export const FaqItem = ({ title, content }: FaqItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={clsx(styles.FaqItem, expanded && styles.FaqItemExpanded)}
    >
      <div className={styles.FaqItemTitle}>
        <p>{title}</p>

        <button
          className={styles.FaqItemButton}
          aria-label={
            expanded
              ? "Icone de menos na cor branco"
              : "Icone de mais na cor branco"
          }
          onClick={() => {
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? (
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_8386_124585"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="25"
              >
                <rect y="0.82959" width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_8386_124585)">
                <path d="M6 13.8296V11.8296H18V13.8296H6Z" fill="#F0F0F0" />
              </g>
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 13.8296H5V11.8296H11V5.82959H13V11.8296H19V13.8296H13V19.8296H11V13.8296Z" />
            </svg>
          )}
        </button>
      </div>
      <div
        className={
          expanded ? styles.FaqItemContentShow : styles.FaqItemContentHidden
        }
      >
        <div className={styles.FaqItemContentInner}>
          {typeof content === "string" ? <p>{content}</p> : content}
        </div>
      </div>
    </article>
  );
};
