import {
  eventStatisticsHours,
  isEventStatisticsHour,
} from "./event-statistics-time";
export const activityKinds = [
  "mission",
  "company",
  "tag",
  "connection",
  "rating",
  "redemption",
] as const;
export type ActivityKind = (typeof activityKinds)[number];
export type ActivityEvent = {
  hour: string;
  kind: ActivityKind;
  people: string[];
};
export function buildActivityHeatmap(events: ActivityEvent[]) {
  events = events.filter((e) => isEventStatisticsHour(e.hour));
  const days = [...new Set(events.map((e) => e.hour.slice(0, 10)))].sort();
  const buckets = new Map<string, { actions: number; people: Set<string> }>();
  for (const event of events) {
    const key = `${event.hour}:${event.kind}`;
    const bucket = buckets.get(key) ?? {
      actions: 0,
      people: new Set<string>(),
    };
    bucket.actions++;
    for (const person of event.people) bucket.people.add(person);
    buckets.set(key, bucket);
  }
  return days.map((day) => ({
    day,
    hours: eventStatisticsHours(day),
    cells: activityKinds.flatMap((kind) =>
      eventStatisticsHours(day).map((hour) => {
        const bucket = buckets.get(
          `${day}T${String(hour).padStart(2, "0")}:${kind}`,
        );
        return {
          kind,
          hour,
          actions: bucket?.actions ?? 0,
          people: bucket?.people.size ?? 0,
        };
      }),
    ),
    actions: events.filter((e) => e.hour.startsWith(day)).length,
    people: new Set(
      events.filter((e) => e.hour.startsWith(day)).flatMap((e) => e.people),
    ).size,
  }));
}
export type ActivityHeatmapData = ReturnType<typeof buildActivityHeatmap>;
