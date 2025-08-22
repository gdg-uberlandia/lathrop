import styles from "./Presentation.module.css";
import ToolTip from "../ToolTip";
import { ReactNode } from "react";
import clsx from "clsx";
import { Tag } from "../Tag";

type Tag = { icon?: string; text: string };

interface PresentationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle: ReactNode;
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
  children,
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
      <a
        className={styles.Link}
        href={button.href}
        target="_blank"
        rel="noreferrer"
      >
        {button.text}
      </a>
    );
  };

  return (
    <section className={clsx(styles.Presentation, className)} {...rest}>
      <h3 className={styles.Title}>{title}</h3>
      {description && <p>{description}</p>}
      {children}
      <p className={styles.PresentationSubtitle}>{subtitle}</p>

      {!!tags.length && (
        <section className={styles.TagList}>
          {tags.map((tag, idx) => (
            <Tag key={idx} icon={tag.icon}>
              {tag.text}
            </Tag>
          ))}
        </section>
      )}

      {renderButton()}
    </section>
  );
};
