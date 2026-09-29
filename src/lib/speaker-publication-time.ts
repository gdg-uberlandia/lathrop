export const SPEAKER_PUBLICATION_TIME_ZONE = "America/Sao_Paulo";

export function publicationInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SPEAKER_PUBLICATION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

// datetime-local has no timezone. Always interpret the value in São Paulo,
// even when the administrator's device uses another timezone.
export function publicationInputToIso(value: string): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new Error("Data e hora inválidas.");
  const guess = new Date(`${value}:00Z`);
  if (!Number.isFinite(guess.getTime()))
    throw new Error("Data e hora inválidas.");
  const offset =
    new Intl.DateTimeFormat("en", {
      timeZone: SPEAKER_PUBLICATION_TIME_ZONE,
      timeZoneName: "longOffset",
    })
      .formatToParts(guess)
      .find((part) => part.type === "timeZoneName")
      ?.value.replace("GMT", "") || "+00:00";
  const date = new Date(`${value}:00${offset}`);
  if (
    !Number.isFinite(date.getTime()) ||
    publicationInputValue(date.toISOString()) !== value
  ) {
    throw new Error("Data e hora inválidas.");
  }
  return date.toISOString();
}

export function validatePublicationTime(
  publishAt: string,
  now = new Date(),
): string | null {
  const date = new Date(publishAt);
  if (!Number.isFinite(date.getTime())) return "Data e hora inválidas.";
  if (date.getTime() <= now.getTime())
    return "Escolha uma data e hora no futuro.";
  const local = publicationInputValue(publishAt);
  if (
    !/:(00|30)$/.test(local) ||
    date.getUTCSeconds() !== 0 ||
    date.getUTCMilliseconds() !== 0
  ) {
    return "Escolha um horário de meia em meia hora (:00 ou :30).";
  }
  return null;
}

export function formatPublicationTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: SPEAKER_PUBLICATION_TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}
