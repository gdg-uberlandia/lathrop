import clsx from "clsx";

interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const SectionHeading = ({
  children,
  className,
  ...props
}: SectionHeadingProps) => (
  <h2
    {...props}
    className={clsx(
      "max-w-4xl text-balance text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl [&_span]:text-devBlue-dark",
      className,
    )}
  >
    {children}
  </h2>
);
