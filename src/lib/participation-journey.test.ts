import assert from "node:assert/strict";
import { test } from "node:test";
import { selectDashboardContext } from "./dashboard-context";
import { buildParticipationJourney } from "./participation-journey";
test("jornada não impõe sequência e mede espera a partir da abertura para pré-cadastros", () => {
  const d = buildParticipationJourney(
    selectDashboardContext({
      profiles: [{ id: "a", createdAt: "2026-10-30T12:00:00Z" }, { id: "b" }],
      ticketTransactions: [
        {
          id: "r",
          participantId: "a",
          type: "reward_redemption",
          createdAt: "2026-10-31T08:10:00-03:00",
        },
      ],
    }),
  );
  assert.equal(d.stages.find((s) => s.id === "redemption")?.people, 1);
  assert.equal(d.stages.find((s) => s.id === "activity")?.people, 0);
  assert.equal(d.medianMinutes, 10);
  assert.equal(d.entry[0].kind, "redemption");
});
