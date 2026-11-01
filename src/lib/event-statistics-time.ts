import { EVENT_STATISTICS_START_AT } from "../helpers/event";

export const EVENT_STATISTICS_START_MS = Date.parse(EVENT_STATISTICS_START_AT);
export function timestamp(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    const n = new Date(value).getTime();
    return Number.isFinite(n) ? n : 0;
  }
  if (value && typeof value === "object") {
    const v = value as {
      toMillis?: () => number;
      seconds?: number;
      _seconds?: number;
    };
    if (v.toMillis) return v.toMillis();
    return (v.seconds ?? v._seconds ?? 0) * 1000;
  }
  return 0;
}
export function isEventStatisticsTime(value: unknown) {
  return timestamp(value) >= EVENT_STATISTICS_START_MS;
}
export function isEventStatisticsHour(hour: string) {
  return isEventStatisticsTime(`${hour}:00:00-03:00`);
}
export function eventStatisticsHours(day: string) {
  return Array.from({ length: 24 }, (_, hour) => hour).filter((hour) =>
    isEventStatisticsHour(`${day}T${String(hour).padStart(2, "0")}`),
  );
}
