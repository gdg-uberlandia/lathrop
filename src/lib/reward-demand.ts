import {
  analyticsText,
  analyticsNumber,
  analyticsHour,
  type DashboardContext,
} from "./dashboard-context";
import { timestamp } from "./event-statistics-time";
export function buildRewardDemand(c: DashboardContext) {
  const transactions = c.transactions.filter(
      (t) => t.type === "reward_redemption",
    ),
    legacy = new Map(
      c.rows("rewardRedemptions").map((r) => [r.id, analyticsText(r.rewardId)]),
    ),
    catalog = new Map(c.rows("rewards").map((r) => [r.id, r]));
  const rewardId = (t: (typeof transactions)[number]) =>
    legacy.get(analyticsText(t.referenceId)) ?? analyticsText(t.referenceId);
  for (const t of transactions) {
    const id = rewardId(t);
    if (id && !catalog.has(id))
      catalog.set(id, { id, name: "Brinde indisponível" });
  }
  const times = transactions.map((t) => timestamp(t.createdAt)),
    hours = times.length
      ? Math.max(1, (Math.max(...times) - Math.min(...times)) / 3600000)
      : 0;
  const rewards = [...catalog]
    .map(([id, r]) => {
      const rows = transactions.filter((t) => rewardId(t) === id),
        byHour = new Map<string, number>(),
        buyers = new Map<string, number>();
      for (const t of rows) {
        const hour = analyticsHour(t.createdAt);
        byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
        const person = analyticsText(t.participantId);
        buyers.set(person, (buyers.get(person) ?? 0) + 1);
      }
      const spent = -rows.reduce(
          (s, t) => s + analyticsNumber(t.ticketDelta),
          0,
        ),
        maxBuyer = Math.max(0, ...buyers.values());
      return {
        id,
        name: analyticsText(r.name) || id,
        units: rows.length,
        people: buyers.size,
        share: transactions.length
          ? (rows.length / transactions.length) * 100
          : 0,
        ticketsSpent: spent,
        averageTicketCost: rows.length ? spent / rows.length : 0,
        unitsPerHour: hours ? rows.length / hours : 0,
        maxPerPerson: maxBuyer,
        stock: typeof r.stock === "number" ? r.stock : null,
        active: r.active === true,
        hourly: [...byHour]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([hour, units]) => ({ hour, units })),
      };
    })
    .sort((a, b) => b.units - a.units);
  const byPerson = new Map<string, number>();
  for (const t of transactions) {
    const id = analyticsText(t.participantId);
    byPerson.set(id, (byPerson.get(id) ?? 0) + 1);
  }
  return {
    units: transactions.length,
    people: byPerson.size,
    observedHours: hours,
    averagePerPerson: byPerson.size ? transactions.length / byPerson.size : 0,
    rewards,
    distribution: [
      { label: "1 unidade", min: 1, max: 1 },
      { label: "2 a 3 unidades", min: 2, max: 3 },
      { label: "4 a 5 unidades", min: 4, max: 5 },
      { label: "6 ou mais unidades", min: 6, max: Infinity },
    ].map((b) => ({
      label: b.label,
      people: [...byPerson.values()].filter((n) => n >= b.min && n <= b.max)
        .length,
    })),
  };
}
export type RewardDemand = ReturnType<typeof buildRewardDemand>;
