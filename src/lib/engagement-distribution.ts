import { isEventStatisticsHour } from "./event-statistics-time";
import type { ActivityEvent } from "./activity-heatmap";
export function buildEngagementDistribution(
  profileIds: string[],
  events: ActivityEvent[],
) {
  events = events.filter((e) => isEventStatisticsHour(e.hour));
  const counts = new Map(profileIds.map((id) => [id, 0]));
  for (const event of events)
    for (const person of new Set(event.people))
      if (counts.has(person)) counts.set(person, counts.get(person)! + 1);
  const values = [...counts.values()].sort((a, b) => a - b),
    total = values.reduce((s, n) => s + n, 0),
    active = values.filter((n) => n > 0);
  const bands = [
    { label: "Nenhuma ação", min: 0, max: 0 },
    { label: "1 a 5 ações", min: 1, max: 5 },
    { label: "6 a 20 ações", min: 6, max: 20 },
    { label: "21 a 50 ações", min: 21, max: 50 },
    { label: "51 ou mais ações", min: 51, max: Infinity },
  ].map((b) => {
    const people = values.filter((v) => v >= b.min && v <= b.max).length;
    return {
      label: b.label,
      people,
      percent: values.length ? (people / values.length) * 100 : 0,
    };
  });
  const topCount = active.length ? Math.ceil(active.length * 0.1) : 0;
  const topActions = topCount
    ? active.slice(-topCount).reduce((s, n) => s + n, 0)
    : 0;
  let cumulative = 0;
  const concentration = [
    { people: 0, actions: 0 },
    ...values.map((v, i) => {
      cumulative += v;
      return {
        people: ((i + 1) / values.length) * 100,
        actions: total ? (cumulative / total) * 100 : 0,
      };
    }),
  ];
  return {
    profiles: values.length,
    active: active.length,
    totalParticipations: total,
    median: values.length
      ? (values[Math.floor((values.length - 1) / 2)] +
          values[Math.floor(values.length / 2)]) /
        2
      : 0,
    p90: values.length ? values[Math.ceil(values.length * 0.9) - 1] : 0,
    bands,
    topCount,
    topShare: total ? (topActions / total) * 100 : 0,
    concentration,
  };
}
export type EngagementDistributionData = ReturnType<
  typeof buildEngagementDistribution
>;
