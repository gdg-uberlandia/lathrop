import assert from "node:assert/strict";
import { test } from "node:test";
import { buildParticipantStatistics } from "./participant-statistics";
import type { DashboardSource } from "./pokedex-dashboard";
const profile = {
  id: "person",
  eventId: "event",
  displayName: "Pessoa",
  email: "p@example.com",
  xp: 2150,
  convertedXp: 2000,
  ticketBalance: 11,
  qrId: "private-qr",
  token: "private-token",
};
const source: DashboardSource = {
  activityCompletions: [
    {
      id: "own",
      eventId: "event",
      participantId: "person",
      activityType: "mission",
      activityId: "mission",
      xpAwarded: 100,
      completedAt: "2026-10-31T11:00:00Z",
    },
    {
      id: "other-person",
      eventId: "event",
      participantId: "other",
      activityType: "mission",
    },
    {
      id: "other-event",
      eventId: "other",
      participantId: "person",
      activityType: "mission",
    },
  ],
  missions: [{ id: "mission", eventId: "event", title: "Missão do evento" }],
  connections: [
    {
      id: "accepted",
      eventId: "event",
      participantIds: ["person", "other"],
      status: "accepted",
      acceptedAt: "2026-10-31T11:00:00Z",
    },
    {
      id: "pending",
      eventId: "event",
      participantIds: ["other", "person"],
      status: "pending",
      lastRequestedAt: "2026-10-31T11:00:00Z",
    },
    {
      id: "removed",
      eventId: "event",
      participantIds: ["person", "other"],
      status: "removed",
    },
    {
      id: "unrelated",
      eventId: "event",
      participantIds: ["a", "b"],
      status: "accepted",
      acceptedAt: "2026-10-31T11:00:00Z",
    },
    {
      id: "elsewhere",
      eventId: "other",
      participantIds: ["person", "b"],
      status: "accepted",
      acceptedAt: "2026-10-31T11:00:00Z",
    },
  ],
  ticketTransactions: [3, 2, 2].map((cost, i) => ({
    id: `redemption-${i}`,
    eventId: "event",
    participantId: "person",
    type: "reward_redemption",
    referenceId: "removed-reward",
    ticketDelta: -cost,
    createdAt: "2026-10-31T11:00:00Z",
  })),
  rewardRedemptions: [
    {
      id: "redemption",
      eventId: "event",
      participantId: "person",
      rewardId: "removed-reward",
      quantity: 3,
      ticketsSpent: 7,
    },
  ],
  raffles: [
    {
      id: "won",
      eventId: "event",
      winnerId: "person",
      status: "drawn",
      prizeName: "Prêmio confirmado",
      drawnAt: "2026-10-31T11:00:00Z",
    },
    {
      id: "pending",
      eventId: "event",
      winnerId: "person",
      status: "awaiting_confirmation",
      prizeName: "Pendente",
    },
    { id: "absent", eventId: "event", prizeName: "Outro prêmio" },
  ],
  raffleAttempts: [
    {
      id: "attempt",
      eventId: "event",
      participantId: "person",
      raffleId: "absent",
      status: "absent",
      selectedAt: "2026-10-31T11:00:00Z",
    },
  ],
};
test("estatísticas isolam o participante e o evento e contam só conexões aceitas", () => {
  const result = buildParticipantStatistics(profile, source, "event")!;
  assert.equal(result.metrics.activities, 1);
  assert.equal(result.activities[0].name, "Missão do evento");
  assert.equal(result.metrics.connections, 1);
  assert.equal(result.metrics.pendingConnections, 1);
  assert.equal(result.metrics.redeemed, 3);
  assert.equal(result.metrics.ticketsSpent, 7);
  assert.equal(result.redemptions[0].name, "removed-reward");
  assert.equal(result.metrics.convertedXp, 2000);
});
test("distingue ausência no sorteio de prêmio confirmado", () => {
  const result = buildParticipantStatistics(profile, source, "event")!;
  assert.equal(result.metrics.wins, 1);
  assert.equal(result.wins[0].prizeName, "Prêmio confirmado");
  assert.equal(result.attempts[0].status, "absent");
  assert.equal(result.attempts[0].prizeName, "Outro prêmio");
});
test("não retorna perfil de outro evento nem campos técnicos do perfil", () => {
  assert.equal(buildParticipantStatistics(profile, source, "other"), null);
  const serialized = JSON.stringify(
    buildParticipantStatistics(profile, source, "event"),
  );
  assert.equal(serialized.includes("private-token"), false);
  assert.equal(serialized.includes("private-qr"), false);
  assert.equal(serialized.includes("p@example.com"), true);
});

test("movimentações distinguem brindes, prêmios, devoluções e conversões automáticas", () => {
  const movements = [
    {
      id: "prize",
      type: "adjustment",
      referenceType: "raffle_winner",
      referenceId: "won",
      ticketDelta: -11,
    },
    {
      id: "refund",
      type: "adjustment",
      referenceType: "raffle_winner",
      referenceId: "won",
      ticketDelta: 9,
    },
    {
      id: "gift",
      type: "reward_redemption",
      referenceType: "reward",
      referenceId: "gift",
      ticketDelta: -5,
    },
    {
      id: "conversion",
      type: "xp_conversion",
      referenceType: "raffle_closure",
      ticketDelta: 10,
    },
    { id: "unknown", type: "adjustment", ticketDelta: -2 },
  ];
  const result = buildParticipantStatistics(
    profile,
    {
      ...source,
      rewards: [{ id: "gift", eventId: "event", name: "Caderno" }],
      ticketTransactions: movements.map((r) => ({
        ...r,
        eventId: "event",
        participantId: profile.id,
        createdAt: "2026-10-31T11:00:00Z",
      })),
    },
    "event",
  )!;
  const byId = new Map(result.tickets.map((r) => [r.id, r]));
  assert.equal(byId.get("prize")?.label, "Consumo por prêmio de sorteio");
  assert.equal(byId.get("prize")?.detail, "Prêmio confirmado");
  assert.equal(byId.get("prize")?.direction, "Saída");
  assert.equal(byId.get("refund")?.label, "Devolução de tickets de sorteio");
  assert.equal(byId.get("refund")?.direction, "Entrada");
  assert.equal(byId.get("gift")?.category, "reward");
  assert.equal(byId.get("gift")?.detail, "Caderno");
  assert.equal(
    byId.get("conversion")?.label,
    "Conversão automática de XP para o sorteio",
  );
  assert.equal(byId.get("unknown")?.category, "correction");
  assert.equal(
    byId.get("unknown")?.detail,
    "Motivo adicional não informado no registro",
  );
});

test("estatísticas individuais descartam ações antes das 08h e dividem resgates pela transação", () => {
  const before = "2026-10-31T07:59:59-03:00",
    opening = "2026-10-31T08:00:00-03:00";
  const d = buildParticipantStatistics(
    profile,
    {
      activityCompletions: [
        {
          id: "early",
          eventId: "event",
          participantId: profile.id,
          activityType: "mission",
          completedAt: before,
          xpAwarded: 500,
        },
        {
          id: "valid",
          eventId: "event",
          participantId: profile.id,
          activityType: "tag",
          completedAt: opening,
          xpAwarded: 25,
        },
      ],
      connections: [
        {
          id: "early",
          eventId: "event",
          participantIds: [profile.id, "other"],
          status: "accepted",
          acceptedAt: before,
        },
      ],
      rewardRedemptions: [
        {
          id: "receipt",
          eventId: "event",
          participantId: profile.id,
          rewardId: "gift",
          quantity: 2,
          ticketsSpent: 8,
          firstRedeemedAt: before,
          lastRedeemedAt: opening,
        },
      ],
      ticketTransactions: [
        {
          id: "early",
          eventId: "event",
          participantId: profile.id,
          type: "reward_redemption",
          referenceId: "gift",
          ticketDelta: -4,
          createdAt: before,
        },
        {
          id: "valid",
          eventId: "event",
          participantId: profile.id,
          type: "reward_redemption",
          referenceId: "receipt",
          ticketDelta: -4,
          createdAt: opening,
        },
      ],
      raffleAttempts: [
        {
          id: "early",
          eventId: "event",
          participantId: profile.id,
          selectedAt: before,
          status: "absent",
        },
      ],
      raffles: [
        {
          id: "early",
          eventId: "event",
          winnerId: profile.id,
          status: "drawn",
          drawnAt: before,
        },
      ],
    },
    "event",
  )!;
  assert.equal(d.metrics.activities, 1);
  assert.equal(d.metrics.eventXp, 25);
  assert.equal(d.metrics.connections, 0);
  assert.equal(d.metrics.redeemed, 1);
  assert.equal(d.metrics.ticketsSpent, 4);
  assert.equal(d.tickets.length, 1);
  assert.equal(d.metrics.wins, 0);
  assert.equal(d.attempts.length, 0);
});
