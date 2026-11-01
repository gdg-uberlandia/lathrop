import {
  selectDashboardContext,
  participantActions,
  analyticsIds,
  analyticsText,
  analyticsHour,
} from "./dashboard-context";
import type { DashboardSource, DashboardFilters } from "./pokedex-dashboard";
export type ExploreSegment =
  | "all"
  | "active"
  | "inactive"
  | "band"
  | "company"
  | "hour"
  | "journey"
  | "interest"
  | "reward"
  | "talk"
  | "network";
export type ExploreSelection = {
  segment: ExploreSegment;
  value?: string;
  title: string;
};
export function exploreDashboardParticipants(
  source: DashboardSource,
  filters: DashboardFilters,
  segment: ExploreSegment,
  value = "",
  search = "",
  page = 1,
) {
  const c = selectDashboardContext(source, filters),
    counts = participantActions(c),
    matches = new Set<string>();
  const add = (id: unknown) => {
    if (typeof id === "string" && c.allowed.has(id)) matches.add(id);
  };
  if (segment === "all") for (const p of c.profiles) add(p.id);
  if (segment === "active" || segment === "inactive" || segment === "band")
    for (const [id, n] of counts) {
      const [min, max] =
        value === "51+"
          ? [51, Infinity]
          : value === "0"
            ? [0, 0]
            : value.split("-").map(Number);
      if (
        segment === "active"
          ? n > 0
          : segment === "inactive"
            ? n === 0
            : Number.isFinite(min) && n >= min && n <= max
      )
        add(id);
    }
  if (segment === "company")
    for (const r of c.completions)
      if (r.activityType === "company" && r.activityId === value)
        add(r.participantId);
  if (segment === "hour") {
    const [hour, kind] = value.split("|");
    for (const r of c.completions)
      if (
        analyticsHour(r.completedAt) === hour &&
        (!kind || r.activityType === kind)
      )
        add(r.participantId);
    for (const r of c.ratings)
      if (analyticsHour(r.completedAt) === hour && (!kind || kind === "rating"))
        add(r.participantId);
    for (const r of c.connections)
      if (
        analyticsHour(r.acceptedAt) === hour &&
        (!kind || kind === "connection")
      )
        for (const id of analyticsIds(r.participantIds)) add(id);
    for (const r of c.transactions)
      if (
        r.type === "reward_redemption" &&
        analyticsHour(r.createdAt) === hour &&
        (!kind || kind === "redemption")
      )
        add(r.participantId);
  }
  if (segment === "interest")
    for (const p of c.profiles)
      if (analyticsIds(p.interests).includes(value)) add(p.id);
  if (segment === "reward") {
    const legacy = new Set(
      c
        .rows("rewardRedemptions")
        .filter((r) => r.rewardId === value)
        .map((r) => r.id),
    );
    for (const r of c.transactions)
      if (
        r.type === "reward_redemption" &&
        (r.referenceId === value || legacy.has(analyticsText(r.referenceId)))
      )
        add(r.participantId);
  }
  if (segment === "talk")
    for (const r of c.ratings) if (r.talkId === value) add(r.participantId);
  if (segment === "network") {
    const connected = new Set(
      c.connections
        .flatMap((r) => analyticsIds(r.participantIds))
        .filter((id) => c.allowed.has(id)),
    );
    for (const p of c.profiles)
      if (value === "isolated" ? !connected.has(p.id) : connected.has(p.id))
        add(p.id);
  }
  if (segment === "journey") {
    if (value === "onboarded")
      for (const p of c.profiles) if (p.onboardingCompleted) add(p.id);
    if (value === "active") for (const [id, n] of counts) if (n > 0) add(id);
    if (value === "activity")
      for (const r of c.completions) add(r.participantId);
    if (value === "network")
      for (const r of c.connections)
        for (const id of analyticsIds(r.participantIds)) add(id);
    if (value === "redemption")
      for (const r of c.transactions)
        if (r.type === "reward_redemption") add(r.participantId);
    if (value === "rating") for (const r of c.ratings) add(r.participantId);
  }
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const rows = c.profiles
    .filter(
      (p) =>
        matches.has(p.id) &&
        normalize(`${p.displayName ?? ""} ${p.email ?? ""}`).includes(
          normalize(search),
        ),
    )
    .map((p) => ({
      id: p.id,
      name: analyticsText(p.displayName) || "Sem nome",
      email: analyticsText(p.email),
      actions: counts.get(p.id) ?? 0,
    }))
    .sort(
      (a, b) => b.actions - a.actions || a.name.localeCompare(b.name, "pt-BR"),
    );
  const pageCount = Math.max(1, Math.ceil(rows.length / 20)),
    safePage = Math.min(Math.max(1, page), pageCount);
  return {
    items: rows.slice((safePage - 1) * 20, safePage * 20),
    page: safePage,
    pageCount,
    total: rows.length,
  };
}
export type DashboardParticipantPage = ReturnType<
  typeof exploreDashboardParticipants
>;
