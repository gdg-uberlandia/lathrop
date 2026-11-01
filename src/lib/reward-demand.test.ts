import assert from "node:assert/strict";
import { test } from "node:test";
import { selectDashboardContext } from "./dashboard-context";
import { buildRewardDemand } from "./reward-demand";
test("demanda usa transações individuais, referências legadas e estoque atual separado", () => {
  const d = buildRewardDemand(
    selectDashboardContext({
      profiles: [{ id: "a" }],
      rewards: [{ id: "gift", name: "Copo", stock: 0 }],
      rewardRedemptions: [{ id: "legacy", rewardId: "gift", quantity: 99 }],
      ticketTransactions: [
        {
          id: "early",
          participantId: "a",
          type: "reward_redemption",
          referenceId: "gift",
          ticketDelta: -5,
          createdAt: "2026-10-31T07:00:00-03:00",
        },
        {
          id: "r1",
          participantId: "a",
          type: "reward_redemption",
          referenceId: "legacy",
          ticketDelta: -5,
          createdAt: "2026-10-31T08:00:00-03:00",
        },
        {
          id: "r2",
          participantId: "a",
          type: "reward_redemption",
          referenceId: "gift",
          ticketDelta: -5,
          createdAt: "2026-10-31T10:00:00-03:00",
        },
      ],
    }),
  );
  assert.equal(d.units, 2);
  assert.equal(d.people, 1);
  assert.equal(d.rewards[0].unitsPerHour, 1);
  assert.equal(d.rewards[0].stock, 0);
  assert.equal(d.distribution[1].people, 1);
});
