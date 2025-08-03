import Image from "next/image";

import styles from "./Presentation.module.css";
import { ReactNode } from "react";
import clsx from "clsx";

type Tag = { icon?: string; text: string };

interface PresentationProps {
  title: ReactNode;
  subtitle: string;
  tags?: Tag[];
  description?: string;
  button?: PresentationButton;
  className?: string;
}

interface PresentationButton {
  text: string;
  href: string;
}

export const Presentation = ({
  title,
  subtitle,
  description,
  tags = [],
  button,
  className,
}: PresentationProps) => {
  return (
    <section className={clsx(styles.Presentation, className)}>
      <h3 className={styles.Title}>{title}</h3>
      {description && <p>{description}</p>}
      <p className="presentation__subtitle">{subtitle}</p>

      {!!tags.length && (
        <section className={styles.TagList}>
          {tags.map((tag, idx) => (
            <div key={idx} className={styles.Tag}>
              {tag.icon && <Image src={tag.icon} alt="" />}
              {tag.text}
            </div>
          ))}
        </section>
      )}

      {button && (
        <a className={styles.Link} href={button.href}>
          {button.text}
        </a>
      )}
    </section>
  );
};
