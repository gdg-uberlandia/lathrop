import Image from "next/image";

import styles from "./Presentation.module.css";

type Tag = { icon?: string; text: string };

interface PresentationProps {
  title: PresentationTitle;
  subtitle: string;
  tags: Tag[];
  description?: string;
  button?: PresentationButton;
}

interface PresentationTitle {
  text: string;
  highlight: string;
  highlightPosition: "start" | "end";
}

interface PresentationButton {
  text: string;
  href: string;
}

export const Presentation = ({
  title,
  subtitle,
  description,
  tags,
  button,
}: PresentationProps) => {
  return (
    <section className={styles.Presentation} id="about">
      <h3 className={styles.Title}>
        {title.highlightPosition === "start" && <span>{title.highlight} </span>}
        {title.text}
        {title.highlightPosition === "end" && <span> {title.highlight}</span>}
      </h3>
      {description && <p>{description}</p>}
      <p className="presentation__subtitle">{subtitle}</p>

      <section className={styles.TagList}>
        {tags.map((tag, idx) => (
          <div key={idx} className={styles.Tag}>
            {tag.icon && <Image src={tag.icon} alt="" />}
            {tag.text}
          </div>
        ))}
      </section>

      {button && (
        <a className={styles.Link} href={button.href}>
          {button.text}
        </a>
      )}
    </section>
  );
};
