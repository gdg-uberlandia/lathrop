import Image from "next/image";

import styles from "./Presentation.module.css";
import ToolTip from "../ToolTip";
import { ReactNode } from "react";
import clsx from "clsx";

type Tag = { icon?: string; text: string };

interface PresentationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle: string;
  tags?: Tag[];
  description?: string;
  button?: PresentationButton;
  showTooltip?: boolean;
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
  showTooltip = false,
  className,
  ...rest
}: PresentationProps) => {


  const renderButton = () => {
    if (!button) return null;

    if (showTooltip) {
      return (
        <ToolTip content="Em breve ⏳" position="bottom" className="mt-4">
          <a className={styles.Link} href={button.href}>
            {button.text}
          </a>
        </ToolTip>
      );
    }

    return (
      <a className={styles.Link} href={button.href}>
        {button.text}
      </a>
    );
  };


  return (
    <section className={clsx(styles.Presentation, className)} {...rest}>
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

      {renderButton()}
    </section>
  );
};
