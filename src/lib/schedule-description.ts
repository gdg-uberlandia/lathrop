const DESCRIPTION_LIMIT = 250;

export function formatScheduleDescription(description?: string | null) {
  const text = description?.trim() ?? "";
  const characters = Array.from(text);
  return characters.length > DESCRIPTION_LIMIT
    ? `${characters
        .slice(0, DESCRIPTION_LIMIT - 1)
        .join("")
        .trimEnd()}…`
    : text;
}
