import { buildEngagementDistribution } from "./engagement-distribution";
import {
  buildActivityHeatmap,
  type ActivityEvent,
  type ActivityKind,
} from "./activity-heatmap";
export type DashboardRow = { id: string; [key: string]: unknown };
export type DashboardSource = Record<string, DashboardRow[]>;
export type DashboardFilters = { from?: string; to?: string; role?: string };

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
const num = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;
const text = (v: unknown) => (typeof v === "string" ? v : "");
const ids = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const sum = (rows: DashboardRow[], key: string) =>
  rows.reduce((n, r) => n + num(r[key]), 0);
const unique = (rows: DashboardRow[]) =>
  new Set(rows.map((r) => text(r.participantId)).filter(Boolean)).size;
const day = (ms: number) =>
  new Date(ms - 3 * 3600000).toISOString().slice(0, 10);

export function buildPokedexDashboard(
  source: DashboardSource,
  filters: DashboardFilters = {},
) {
  const rows = (name: string) => source[name] ?? [];
  const start = filters.from
    ? Date.parse(`${filters.from}T00:00:00-03:00`)
    : -Infinity;
  const end = filters.to
    ? Date.parse(`${filters.to}T23:59:59.999-03:00`)
    : Infinity;
  const inPeriod = (v: unknown) => {
    const t = timestamp(v);
    return t > 0 && t >= start && t <= end;
  };
  const allProfiles = new Map(rows("profiles").map((p) => [p.id, p]));
  const profiles = rows("profiles").filter(
    (p) =>
      (!filters.role ||
        filters.role === "all" ||
        (ids(p.accessRoles).length
          ? ids(p.accessRoles)
          : ["participant"]
        ).includes(filters.role)) &&
      (!timestamp(p.createdAt) || timestamp(p.createdAt) <= end),
  );
  const allowed = new Set(profiles.map((p) => p.id));
  const eligible = (r: DashboardRow) => allowed.has(text(r.participantId));
  const completions = rows("activityCompletions").filter(
    (r) => eligible(r) && inPeriod(r.completedAt),
  );
  const connections = rows("connections").filter(
    (r) =>
      r.status === "accepted" &&
      inPeriod(r.acceptedAt) &&
      ids(r.participantIds).some((id) => allowed.has(id)),
  );
  const ratings = rows("talk-ratings").filter(
    (r) => eligible(r) && inPeriod(r.completedAt),
  );
  const transactions = rows("ticketTransactions").filter(
    (r) => eligible(r) && inPeriod(r.createdAt),
  );
  const redemptionTransactions = transactions.filter(
    (r) => r.type === "reward_redemption",
  );
  // Redemptions aggregate repeated exchanges; transactions preserve each exchange's date.
  const redemptions = rows("rewardRedemptions").filter(eligible);
  const active = new Set<string>();
  const timeline = new Map<string, { active: Set<string>; actions: number }>();
  const activityEvents: ActivityEvent[] = [];
  function record(value: unknown, people: string[], kind: ActivityKind) {
    const ms = timestamp(value);
    if (!ms) return;
    const key = new Date(ms - 3 * 3600000).toISOString().slice(0, 13);
    activityEvents.push({
      hour: key,
      kind,
      people: people.filter((id) => allowed.has(id)),
    });
    const bucket = timeline.get(key) ?? {
      active: new Set<string>(),
      actions: 0,
    };
    for (const id of people)
      if (allowed.has(id)) {
        active.add(id);
        bucket.active.add(id);
      }
    bucket.actions++;
    timeline.set(key, bucket);
  }
  for (const r of completions) {
    const kind = text(r.activityType);
    if (kind === "mission" || kind === "company" || kind === "tag")
      record(r.completedAt, [text(r.participantId)], kind);
  }
  for (const r of connections)
    record(r.acceptedAt, ids(r.participantIds), "connection");
  for (const r of ratings)
    record(r.completedAt, [text(r.participantId)], "rating");
  for (const r of redemptionTransactions)
    record(r.createdAt, [text(r.participantId)], "redemption");
  const activityTypes = ["mission", "company", "tag"].map((type) => {
    const matching = completions.filter((r) => r.activityType === type);
    return { type, count: matching.length, participants: unique(matching) };
  });
  const companies = rows("companies")
    .map((c) => {
      const visits = completions.filter(
        (r) => r.activityType === "company" && r.activityId === c.id,
      );
      return {
        id: c.id,
        name: text(c.name) || c.id,
        visitors: unique(visits),
        visits: visits.length,
        reach: profiles.length ? (unique(visits) / profiles.length) * 100 : 0,
      };
    })
    .sort((a, b) => b.visitors - a.visitors);
  const activities = [
    ...rows("missions").map((r): DashboardRow & { kind: string } => ({
      ...r,
      kind: "mission",
    })),
    ...rows("tags").map((r): DashboardRow & { kind: string } => ({
      ...r,
      kind: "tag",
    })),
  ]
    .map((r) => ({
      id: r.id,
      name: text(r.title) || text(r.name) || r.id,
      type: r.kind,
      count: completions.filter(
        (c) => c.activityType === r.kind && c.activityId === r.id,
      ).length,
    }))
    .sort((a, b) => b.count - a.count);
  const rewards = rows("rewards").map((r) => {
    const history = redemptions.filter((d) => d.rewardId === r.id);
    // Support reward references and legacy redemption references.
    const historyIds = new Set(history.map((d) => d.id));
    const periodExchanges = redemptionTransactions.filter(
      (t) => t.referenceId === r.id || historyIds.has(text(t.referenceId)),
    );
    const filtered = Boolean(filters.from || filters.to);
    return {
      id: r.id,
      name: text(r.name) || r.id,
      stock: num(r.stock),
      active: r.active === true,
      redeemed: filtered ? periodExchanges.length : sum(history, "quantity"),
      redeemers: filtered ? unique(periodExchanges) : unique(history),
      ticketsSpent: filtered
        ? -sum(periodExchanges, "ticketDelta")
        : sum(history, "ticketsSpent"),
    };
  });
  const talkRatings = rows("talks")
    .map((t) => {
      const values = ratings.filter((r) => r.talkId === t.id);
      const avg = (key: string) =>
        values.length ? sum(values, key) / values.length : null;
      return {
        id: t.id,
        title: text(t.title) || t.id,
        count: values.length,
        reviewers: unique(values),
        speaker: avg("speakerRating"),
        content: avg("contentRating"),
        comprehension: avg("comprehensionRating"),
      };
    })
    .sort((a, b) => b.count - a.count);
  const winners = rows("raffles")
    .filter(
      (r) =>
        r.status === "drawn" &&
        r.winnerId &&
        inPeriod(r.drawnAt) &&
        (!filters.role ||
          filters.role === "all" ||
          allowed.has(text(r.winnerId))),
    )
    .map((r) => {
      const profile = allProfiles.get(text(r.winnerId));
      return {
        id: r.id,
        participantId: text(r.winnerId),
        prizeName: text(r.prizeName),
        name:
          text(r.winnerName) ||
          text(profile?.displayName) ||
          "Perfil indisponível",
        email: text(profile?.email) || null,
        confirmedAt: new Date(timestamp(r.drawnAt)).toISOString(),
      };
    })
    .sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt));
  const attempts = rows("missionAttempts").filter(
    (r) => eligible(r) && inPeriod(r.updatedAt),
  );
  const outcomes = Object.entries(
    attempts.reduce<Record<string, number>>((out, r) => {
      const key = text(r.outcome) || "unknown";
      out[key] = (out[key] ?? 0) + 1;
      return out;
    }, {}),
  ).map(([outcome, count]) => ({ outcome, count }));
  const xpBands = [
    { label: "0 XP", min: 0, max: 0 },
    { label: "1–499 XP", min: 1, max: 499 },
    { label: "500–1.999 XP", min: 500, max: 1999 },
    { label: "2.000–4.999 XP", min: 2000, max: 4999 },
    { label: "5.000+ XP", min: 5000, max: Infinity },
  ].map((b) => ({
    label: b.label,
    count: profiles.filter((p) => num(p.xp) >= b.min && num(p.xp) <= b.max)
      .length,
  }));
  return {
    filters,
    base: {
      profiles: profiles.length,
      onboarded: profiles.filter((p) => p.onboardingCompleted).length,
      newProfiles: profiles.filter((p) => inPeriod(p.createdAt)).length,
      xp: sum(profiles, "xp"),
      ticketBalance: sum(profiles, "ticketBalance"),
    },
    metrics: {
      active: active.size,
      activities: completions.length,
      connections: connections.length,
      redeemers: unique(redemptionTransactions),
      redeemed: rewards.reduce((n, r) => n + r.redeemed, 0),
      ratings: ratings.length,
      reviewers: unique(ratings),
      winners: winners.length,
    },
    timeline: [...timeline]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, b]) => ({
        hour,
        actions: b.actions,
        active: b.active.size,
      })),
    heatmap: buildActivityHeatmap(activityEvents),
    engagement: buildEngagementDistribution([...allowed], activityEvents),
    activityTypes,
    companies,
    activities,
    rewards,
    talkRatings,
    winners,
    outcomes,
    xpBands,
    latestActivityDay: timeline.size
      ? day(
          Math.max(
            ...[...timeline.keys()].map((k) => Date.parse(`${k}:00:00-03:00`)),
          ),
        )
      : null,
  };
}
export type PokedexDashboard = ReturnType<typeof buildPokedexDashboard> & {
  updatedAt: string;
  environment: string;
  eventId: string;
};
