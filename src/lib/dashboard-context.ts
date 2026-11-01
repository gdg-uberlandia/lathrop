import type {
  DashboardSource,
  DashboardFilters,
  DashboardRow,
} from "./pokedex-dashboard";
import { EVENT_STATISTICS_START_MS, timestamp } from "./event-statistics-time";
export const analyticsText = (v: unknown) => (typeof v === "string" ? v : "");
export const analyticsNumber = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;
export const analyticsIds = (v: unknown): string[] =>
  Array.isArray(v)
    ? [...new Set(v.filter((id): id is string => typeof id === "string"))]
    : [];
export const analyticsHour = (value: unknown) =>
  new Date(timestamp(value) - 3 * 3600000).toISOString().slice(0, 13);
export function selectDashboardContext(
  source: DashboardSource,
  filters: DashboardFilters = {},
) {
  const rows = (name: string) => source[name] ?? [];
  const start = Math.max(
    EVENT_STATISTICS_START_MS,
    filters.from
      ? Date.parse(`${filters.from}T00:00:00-03:00`)
      : EVENT_STATISTICS_START_MS,
  );
  const end = filters.to
    ? Date.parse(`${filters.to}T23:59:59.999-03:00`)
    : Infinity;
  const inPeriod = (v: unknown) => timestamp(v) >= start && timestamp(v) <= end;
  const allProfiles = new Map(rows("profiles").map((p) => [p.id, p]));
  const profiles = rows("profiles").filter(
    (p) =>
      (!filters.role ||
        filters.role === "all" ||
        (analyticsIds(p.accessRoles).length
          ? analyticsIds(p.accessRoles)
          : ["participant"]
        ).includes(filters.role)) &&
      (!timestamp(p.createdAt) || timestamp(p.createdAt) <= end),
  );
  const allowed = new Set(profiles.map((p) => p.id)),
    eligible = (r: DashboardRow) => allowed.has(analyticsText(r.participantId));
  const completions = rows("activityCompletions").filter(
    (r) => eligible(r) && inPeriod(r.completedAt),
  );
  const connections = rows("connections").filter(
    (r) =>
      r.status === "accepted" &&
      inPeriod(r.acceptedAt) &&
      analyticsIds(r.participantIds).some((id) => allowed.has(id)),
  );
  const ratings = rows("talk-ratings").filter(
    (r) => eligible(r) && inPeriod(r.completedAt),
  );
  const transactions = rows("ticketTransactions").filter(
    (r) => eligible(r) && inPeriod(r.createdAt),
  );
  return {
    source,
    filters,
    rows,
    start,
    end,
    inPeriod,
    allProfiles,
    profiles,
    allowed,
    eligible,
    completions,
    connections,
    ratings,
    transactions,
  };
}
export type DashboardContext = ReturnType<typeof selectDashboardContext>;
export function participantActions(c: DashboardContext) {
  const counts = new Map(c.profiles.map((p) => [p.id, 0]));
  for (const r of [
    ...c.completions,
    ...c.ratings,
    ...c.transactions.filter((t) => t.type === "reward_redemption"),
  ]) {
    const id = analyticsText(r.participantId);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  for (const r of c.connections)
    for (const id of analyticsIds(r.participantIds))
      if (c.allowed.has(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
  return counts;
}
