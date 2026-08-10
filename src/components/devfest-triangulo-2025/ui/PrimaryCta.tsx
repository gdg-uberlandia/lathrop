import clsx from "clsx";

interface PrimaryCtaProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean;
}

export const PrimaryCta = ({
  children,
  className,
  disabled = false,
  onClick,
  ...props
}: PrimaryCtaProps) => (
  <a
    {...props}
    className={clsx(
      "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-devBlue-dark px-6 py-3 text-sm font-bold text-white no-underline transition-shadow duration-150 hover:bg-devBlue-dark hover:text-white hover:ring-1 hover:ring-inset hover:ring-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-devBlue focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none",
      disabled &&
        "pointer-events-none cursor-not-allowed bg-devGray hover:ring-0",
      className,
    )}
    aria-disabled={disabled || undefined}
    tabIndex={disabled ? -1 : props.tabIndex}
    onClick={(event) => {
      if (disabled) event.preventDefault();
      onClick?.(event);
    }}
  >
    {children}
  </a>
);
