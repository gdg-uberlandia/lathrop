import ToolTip from "../ToolTip";
import { ReactNode } from "react";
import clsx from "clsx";
import { Tag } from "../Tag";
import { primaryCtaClassName } from "../primary-cta";

type Tag = { icon?: string; text: string };

interface PresentationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  tags?: Tag[];
  description?: string;
  button?: PresentationButton;
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
  children,
  ...rest
}: PresentationProps) => {
  const renderButton = () => {
    if (!button) return null;

    return (
      <a
        className={primaryCtaClassName}
        href={button.href}
        target="_blank"
        rel="noreferrer"
      >
        {button.text}
      </a>
    );
  };

  return (
    <section
      className={clsx(
        "mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:py-16 lg:px-8",
        className,
      )}
      {...rest}
    >
      <h2 className="max-w-4xl text-balance text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl [&_span]:text-devBlue-dark">
        {title}
      </h2>
      {description && (
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
          {description}
        </p>
      )}
      {children}
      {subtitle && (
        <p className="max-w-3xl text-pretty text-lg font-medium leading-relaxed text-white/80 sm:text-xl [&_span]:text-devBlue-dark">
          {subtitle}
        </p>
      )}

      {!!tags.length && (
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag, idx) => (
            <Tag key={idx} icon={tag.icon}>
              {tag.text}
            </Tag>
          ))}
        </div>
      )}

      {renderButton()}
    </section>
  );
};
