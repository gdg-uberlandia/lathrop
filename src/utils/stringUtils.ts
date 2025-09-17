export const pluralize = (text: string, size: number): string => {
  return `${text}${size > 0 ? "s" : ""}`;
};
