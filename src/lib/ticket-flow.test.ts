import assert from "node:assert/strict";
import { test } from "node:test";
import { buildTicketFlow, type TicketFlowTransaction } from "./ticket-flow";
const rows: TicketFlowTransaction[] = [
  {
    participantId: "a",
    type: "onboarding_grant",
    referenceType: "onboarding",
    delta: 1,
    date: "2026-10-31",
  },
  {
    participantId: "a",
    type: "xp_conversion",
    referenceType: "raffle_closure",
    delta: 10,
    date: "2026-10-31",
  },
  {
    participantId: "a",
    type: "reward_redemption",
    referenceType: "reward",
    delta: -4,
    date: "2026-10-31",
  },
  {
    participantId: "a",
    type: "adjustment",
    referenceType: "raffle_winner",
    delta: -7,
    date: "2026-10-31",
  },
  {
    participantId: "a",
    type: "adjustment",
    referenceType: "raffle_winner",
    delta: 7,
    date: "2026-11-01",
  },
];
test("fluxo separa bônus, conversão automática, brindes, sorteios e devoluções", () => {
  const d = buildTicketFlow(rows, rows, 7);
  assert.equal(d.incoming, 18);
  assert.equal(d.outgoing, 11);
  assert.equal(d.net, 7);
  assert.equal(d.movements.find((m) => m.id === "raffle:out")?.amount, 7);
  assert.equal(d.movements.find((m) => m.id === "raffle-return:in")?.amount, 7);
  assert.equal(d.movements.find((m) => m.id === "reward:out")?.amount, 4);
  assert.equal(d.reconciliation.difference, 0);
  assert.equal(d.daily[0].net, 0);
  assert.equal(d.daily[1].net, 7);
});
test("fluxo do período não confunde saldo atual e conferência do histórico completo", () => {
  const d = buildTicketFlow(rows.slice(-1), rows, 9);
  assert.equal(d.net, 7);
  assert.equal(d.reconciliation.recordedBalance, 7);
  assert.equal(d.reconciliation.difference, 2);
  assert.equal(d.reconciliation.currentBalance, 9);
});
test("registros neutros e sem data não criam entradas artificiais", () => {
  const undated = {
    participantId: "a",
    type: "adjustment",
    referenceType: "unknown",
    delta: 0,
    date: null,
  };
  const d = buildTicketFlow([undated], [undated], 0);
  assert.equal(d.incoming, 0);
  assert.equal(d.outgoing, 0);
  assert.equal(d.daily.length, 0);
  assert.equal(d.movements[0].direction, "neutral");
  assert.equal(d.reconciliation.undatedTransactions, 1);
  assert.equal(buildTicketFlow([], [], 0).net, 0);
});
