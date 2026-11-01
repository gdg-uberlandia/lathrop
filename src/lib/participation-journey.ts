import {
  participantActions,
  analyticsIds,
  analyticsText,
  type DashboardContext,
} from "./dashboard-context";
import { timestamp } from "./event-statistics-time";
export function buildParticipationJourney(c: DashboardContext) {
  const counts = participantActions(c),
    groups: Record<string, Set<string>> = {
      activity: new Set(
        c.completions.map((r) => analyticsText(r.participantId)),
      ),
      network: new Set(
        c.connections
          .flatMap((r) => analyticsIds(r.participantIds))
          .filter((id) => c.allowed.has(id)),
      ),
      redemption: new Set(
        c.transactions
          .filter((r) => r.type === "reward_redemption")
          .map((r) => analyticsText(r.participantId)),
      ),
      rating: new Set(c.ratings.map((r) => analyticsText(r.participantId))),
    };
  const stages = [
    {
      id: "onboarded",
      label: "Onboarding concluído (atual)",
      people: c.profiles.filter((p) => p.onboardingCompleted).length,
    },
    {
      id: "active",
      label: "Ao menos uma ação no período",
      people: [...counts.values()].filter((n) => n > 0).length,
    },
    ...Object.entries(groups).map(([id, set]) => ({
      id,
      label: (
        {
          activity: "Concluíram atividades",
          network: "Fizeram networking",
          redemption: "Resgataram brindes",
          rating: "Avaliaram palestras",
        } as Record<string, string>
      )[id],
      people: set.size,
    })),
  ].map((s) => ({
    ...s,
    percent: c.profiles.length ? (s.people / c.profiles.length) * 100 : 0,
  }));
  const first = new Map<string, { at: number; kind: string }>();
  const record = (id: string, at: unknown, kind: string) => {
    if (!c.allowed.has(id)) return;
    const ms = timestamp(at);
    if (!first.has(id) || ms < first.get(id)!.at)
      first.set(id, { at: ms, kind });
  };
  for (const r of c.completions)
    record(
      analyticsText(r.participantId),
      r.completedAt,
      analyticsText(r.activityType),
    );
  for (const r of c.ratings)
    record(analyticsText(r.participantId), r.completedAt, "rating");
  for (const r of c.connections)
    for (const id of analyticsIds(r.participantIds))
      record(id, r.acceptedAt, "connection");
  for (const r of c.transactions)
    if (r.type === "reward_redemption")
      record(analyticsText(r.participantId), r.createdAt, "redemption");
  const delays = c.profiles
    .filter((p) => first.has(p.id))
    .map((p) =>
      Math.max(
        0,
        (first.get(p.id)!.at - Math.max(c.start, timestamp(p.createdAt))) /
          60000,
      ),
    )
    .sort((a, b) => a - b);
  const medianMinutes = delays.length
    ? (delays[Math.floor((delays.length - 1) / 2)] +
        delays[Math.floor(delays.length / 2)]) /
      2
    : null;
  const entry = Object.entries(
    [...first.values()].reduce<Record<string, number>>((a, v) => {
      a[v.kind] = (a[v.kind] ?? 0) + 1;
      return a;
    }, {}),
  )
    .map(([kind, people]) => ({ kind, people }))
    .sort((a, b) => b.people - a.people);
  const overlap = [
    ["activity", "network"],
    ["activity", "redemption"],
    ["network", "redemption"],
  ].map(([a, b]) => ({
    first: a,
    second: b,
    people: [...groups[a]].filter((id) => groups[b].has(id)).length,
  }));
  return {
    base: c.profiles.length,
    stages,
    medianMinutes,
    measuredPeople: delays.length,
    entry,
    overlap,
  };
}
export type ParticipationJourney = ReturnType<typeof buildParticipationJourney>;
