import type { DashboardRow } from "./pokedex-dashboard";
import { isEventStatisticsTime, timestamp } from "./event-statistics-time";

// A redemption document aggregates all exchanges. Individual ticket transactions
// preserve dates and allow an exact event-only count even across the opening time.
export function eventRewardRedemptions(
  redemptions: DashboardRow[],
  transactions: DashboardRow[],
) {
  const historicalIds = new Map(redemptions.map((r) => [r.id, r]));
  const byReward = new Map<
    string,
    {
      id: string;
      rewardId: string;
      quantity: number;
      ticketsSpent: number;
      firstRedeemedAt: string;
      lastRedeemedAt: string;
    }
  >();
  for (const t of transactions) {
    if (t.type !== "reward_redemption" || !isEventStatisticsTime(t.createdAt))
      continue;
    const reference = typeof t.referenceId === "string" ? t.referenceId : "";
    const history =
      historicalIds.get(reference) ??
      redemptions.find((r) => r.rewardId === reference);
    const rewardId =
      typeof history?.rewardId === "string" ? history.rewardId : reference;
    if (!rewardId) continue;
    const at = new Date(timestamp(t.createdAt)).toISOString();
    const record = byReward.get(rewardId) ?? {
      id: history?.id ?? rewardId,
      rewardId,
      quantity: 0,
      ticketsSpent: 0,
      firstRedeemedAt: at,
      lastRedeemedAt: at,
    };
    record.quantity++;
    record.ticketsSpent +=
      typeof t.ticketDelta === "number" ? -t.ticketDelta : 0;
    if (at < record.firstRedeemedAt) record.firstRedeemedAt = at;
    if (at > record.lastRedeemedAt) record.lastRedeemedAt = at;
    byReward.set(rewardId, record);
  }
  return [...byReward.values()];
}
