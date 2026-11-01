import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildPokedexDashboard,
  type DashboardSource,
} from "./pokedex-dashboard";
import { dashboardCsv } from "./dashboard-csv";
const source: DashboardSource = {
  profiles: [
    {
      id: "a",
      displayName: "Ana",
      email: "ana@example.com",
      accessRoles: ["participant"],
      createdAt: "2026-10-30T12:00:00Z",
      onboardingCompleted: true,
      xp: 500,
      ticketBalance: 7,
    },
    { id: "b", accessRoles: ["admin"], createdAt: "2026-10-30T12:00:00Z" },
  ],
  activityCompletions: [
    {
      id: "c1",
      participantId: "a",
      activityType: "company",
      activityId: "company",
      completedAt: "2026-11-01T02:59:59Z",
    },
    {
      id: "c2",
      participantId: "a",
      activityType: "tag",
      activityId: "tag",
      completedAt: "2026-11-01T03:00:00Z",
    },
  ],
  connections: [
    {
      id: "conn",
      participantIds: ["a", "b"],
      status: "accepted",
      acceptedAt: "2026-10-31T12:00:00Z",
    },
    {
      id: "pending",
      participantIds: ["a", "b"],
      status: "pending",
      acceptedAt: null,
    },
  ],
  "talk-ratings": [
    {
      id: "r1",
      participantId: "a",
      talkId: "talk",
      completedAt: "2026-10-31T12:00:00Z",
      speakerRating: 5,
      contentRating: 4,
      comprehensionRating: 3,
    },
    {
      id: "r2",
      participantId: "a",
      talkId: "talk2",
      completedAt: "2026-10-31T12:00:00Z",
      speakerRating: 3,
      contentRating: 4,
      comprehensionRating: 5,
    },
  ],
  talks: [
    { id: "talk", title: "Talk" },
    { id: "talk2", title: "Talk 2" },
    { id: "unrated", title: "Unrated" },
  ],
  rewardRedemptions: [
    {
      id: "redemption",
      participantId: "a",
      rewardId: "gift",
      quantity: 2,
      ticketsSpent: 10,
    },
  ],
  rewards: [{ id: "gift", name: "Gift", stock: 5, active: true }],
  ticketTransactions: [
    {
      id: "t1",
      participantId: "a",
      type: "reward_redemption",
      referenceId: "gift",
      ticketDelta: -5,
      createdAt: "2026-10-31T12:00:00Z",
    },
    {
      id: "t2",
      participantId: "a",
      type: "reward_redemption",
      referenceId: "gift",
      ticketDelta: -5,
      createdAt: "2026-11-01T12:00:00Z",
    },
  ],
  raffles: [
    {
      id: "drawn",
      status: "drawn",
      winnerId: "a",
      winnerName: "Ana no sorteio",
      prizeName: "Prêmio",
      drawnAt: "2026-10-31T12:00:00Z",
    },
    {
      id: "pending",
      status: "awaiting_confirmation",
      winnerId: "a",
      drawnAt: "2026-10-31T12:00:00Z",
    },
    {
      id: "missing",
      status: "drawn",
      winnerId: "deleted",
      winnerName: "Perfil excluído",
      prizeName: "Outro",
      drawnAt: "2026-10-31T12:00:00Z",
    },
  ],
  companies: [{ id: "company", name: "Empresa" }],
};
test("deduplica pessoas ativas e avaliadores; não soma avaliações como pessoas", () => {
  const result = buildPokedexDashboard(source);
  assert.equal(result.metrics.active, 2);
  assert.equal(result.metrics.ratings, 2);
  assert.equal(result.metrics.reviewers, 1);
  assert.equal(
    result.talkRatings.find((t) => t.id === "unrated")?.content,
    null,
  );
  assert.equal(result.metrics.redeemed, 2);
});
test("filtra por dia de Brasília e usa transações para resgates parciais", () => {
  const result = buildPokedexDashboard(source, {
    from: "2026-10-31",
    to: "2026-10-31",
    role: "participant",
  });
  assert.equal(result.metrics.activities, 1);
  assert.equal(result.metrics.active, 1);
  assert.equal(result.metrics.connections, 1);
  assert.equal(result.rewards[0].redeemed, 1);
  assert.equal(result.rewards[0].ticketsSpent, 5);
  assert.equal(result.rewards[0].stock, 5);
  assert.equal(result.base.ticketBalance, 7);
  assert.equal(result.companies[0].reach, 100);
  assert.equal(
    result.timeline.reduce((n, b) => n + b.actions, 0),
    5,
  );
});
test("mostra somente ganhadores confirmados e preserva resultado de perfil excluído", () => {
  const result = buildPokedexDashboard(source);
  assert.equal(result.winners.length, 2);
  assert.equal(
    result.winners.find((w) => w.id === "drawn")?.participantId,
    "a",
  );
  assert.equal(
    result.winners.find((w) => w.id === "missing")?.participantId,
    "deleted",
  );
  assert.equal(
    result.winners.find((w) => w.id === "drawn")?.email,
    "ana@example.com",
  );
  assert.equal(
    result.winners.find((w) => w.id === "drawn")?.name,
    "Ana no sorteio",
  );
  assert.equal(result.winners.find((w) => w.id === "missing")?.email, null);
  assert.equal(JSON.stringify(result).includes('"accessRoles"'), false);
});
test("CSV preserva aspas e neutraliza fórmulas de planilha", () => {
  assert.equal(
    dashboardCsv([['=HYPERLINK("a")', "Ana; Silva", "a\nb"]]),
    '\uFEFF"\'=HYPERLINK(""a"")";"Ana; Silva";"a\nb"',
  );
});
