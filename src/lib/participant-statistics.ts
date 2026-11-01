import {
  timestamp,
  type DashboardRow,
  type DashboardSource,
} from "./pokedex-dashboard";
const text = (v: unknown) => (typeof v === "string" ? v : "");
const number = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;
const iso = (v: unknown) =>
  timestamp(v) ? new Date(timestamp(v)).toISOString() : null;

export function describeTicketMovement(
  type: string,
  referenceType: string,
  delta: number,
) {
  if (type === "onboarding_grant")
    return { category: "credit", label: "Bônus de cadastro" };
  if (type === "xp_conversion")
    return {
      category: "credit",
      label:
        referenceType === "raffle_closure"
          ? "Conversão automática de XP para o sorteio"
          : "Conversão de XP em tickets",
    };
  if (type === "reward_redemption")
    return { category: "reward", label: "Resgate de brinde" };
  if (type === "adjustment" && referenceType === "raffle_winner")
    return {
      category: "raffle",
      label:
        delta < 0
          ? "Consumo por prêmio de sorteio"
          : delta > 0
            ? "Devolução de tickets de sorteio"
            : "Movimentação de sorteio sem alteração de saldo",
    };
  return {
    category: "correction",
    label:
      delta < 0
        ? "Correção de saldo — débito"
        : delta > 0
          ? "Correção de saldo — crédito"
          : "Registro sem alteração de saldo",
  };
}

export function buildParticipantStatistics(
  profile: DashboardRow,
  source: DashboardSource,
  eventId: string,
) {
  if (profile.eventId !== eventId) return null;
  const owned = (name: string) =>
    (source[name] ?? []).filter(
      (r) => r.eventId === eventId && r.participantId === profile.id,
    );
  const catalog = (name: string) =>
    new Map(
      (source[name] ?? [])
        .filter((r) => r.eventId === eventId)
        .map((r) => [
          r.id,
          text(r.title) || text(r.name) || text(r.prizeName) || r.id,
        ]),
    );
  const missions = catalog("missions"),
    companies = catalog("companies"),
    tags = catalog("tags"),
    talks = catalog("talks"),
    rewards = catalog("rewards"),
    raffles = catalog("raffles");
  const activities = owned("activityCompletions")
    .map((r) => ({
      id: r.id,
      type: text(r.activityType),
      name:
        (r.activityType === "mission"
          ? missions
          : r.activityType === "company"
            ? companies
            : tags
        ).get(text(r.activityId)) ?? text(r.activityId),
      xp: number(r.xpAwarded),
      completedAt: iso(r.completedAt),
    }))
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const connections = (source.connections ?? []).filter(
    (r) =>
      r.eventId === eventId &&
      Array.isArray(r.participantIds) &&
      r.participantIds.includes(profile.id),
  );
  const redemptions = owned("rewardRedemptions").map((r) => ({
    id: r.id,
    name: rewards.get(text(r.rewardId)) ?? text(r.rewardId),
    quantity: number(r.quantity),
    ticketsSpent: number(r.ticketsSpent),
    firstRedeemedAt: iso(r.firstRedeemedAt),
    lastRedeemedAt: iso(r.lastRedeemedAt),
  }));
  const ratings = owned("talk-ratings").map((r) => ({
    id: r.id,
    title: talks.get(text(r.talkId)) ?? text(r.talkId),
    speaker: number(r.speakerRating),
    content: number(r.contentRating),
    comprehension: number(r.comprehensionRating),
    completedAt: iso(r.completedAt),
  }));
  const tickets = owned("ticketTransactions")
    .map((r) => ({
      id: r.id,
      type: text(r.type),
      ...describeTicketMovement(
        text(r.type),
        text(r.referenceType),
        number(r.ticketDelta),
      ),
      direction:
        number(r.ticketDelta) > 0
          ? "Entrada"
          : number(r.ticketDelta) < 0
            ? "Saída"
            : "Sem alteração",
      detail:
        r.referenceType === "raffle_winner"
          ? (raffles.get(text(r.referenceId)) ?? "Prêmio indisponível")
          : r.type === "reward_redemption"
            ? (rewards.get(text(r.referenceId)) ?? "Brinde indisponível")
            : r.type === "adjustment"
              ? "Motivo adicional não informado no registro"
              : null,
      delta: number(r.ticketDelta),
      convertedXp: number(r.convertedXp),
      createdAt: iso(r.createdAt),
    }))
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  const attempts = owned("raffleAttempts").map((r) => ({
    id: r.id,
    prizeName: raffles.get(text(r.raffleId)) ?? text(r.raffleId),
    status: text(r.status),
    selectedAt: iso(r.selectedAt),
    resolvedAt: iso(r.resolvedAt),
  }));
  const wins = (source.raffles ?? [])
    .filter(
      (r) =>
        r.eventId === eventId &&
        r.winnerId === profile.id &&
        r.status === "drawn",
    )
    .map((r) => ({
      id: r.id,
      prizeName: text(r.prizeName),
      confirmedAt: iso(r.drawnAt),
    }));
  const quizAttempts = owned("missionAttempts").map((r) => ({
    id: r.id,
    name: missions.get(text(r.missionId)) ?? text(r.missionId),
    attempts: number(r.attempts),
    outcome: text(r.outcome),
    score: typeof r.lastScore === "number" ? r.lastScore : null,
    questions: typeof r.questionCount === "number" ? r.questionCount : null,
    updatedAt: iso(r.updatedAt),
  }));
  return {
    eventId,
    profile: {
      id: profile.id,
      name: text(profile.displayName) || "Sem nome",
      email: text(profile.email),
      company: text(profile.company) || null,
      role: text(profile.role) || null,
      accessRoles: Array.isArray(profile.accessRoles)
        ? profile.accessRoles.filter((v): v is string => typeof v === "string")
        : ["participant"],
      onboardingCompleted: profile.onboardingCompleted === true,
      createdAt: iso(profile.createdAt),
      updatedAt: iso(profile.updatedAt),
    },
    metrics: {
      xp: number(profile.xp),
      convertedXp: number(profile.convertedXp),
      ticketBalance: number(profile.ticketBalance),
      activities: activities.length,
      missions: activities.filter((r) => r.type === "mission").length,
      companies: activities.filter((r) => r.type === "company").length,
      tags: activities.filter((r) => r.type === "tag").length,
      connections: connections.filter((r) => r.status === "accepted").length,
      pendingConnections: connections.filter((r) => r.status === "pending")
        .length,
      ratings: ratings.length,
      redeemed: redemptions.reduce((s, r) => s + r.quantity, 0),
      ticketsSpent: redemptions.reduce((s, r) => s + r.ticketsSpent, 0),
      wins: wins.length,
    },
    activities,
    redemptions,
    ratings,
    tickets,
    attempts,
    wins,
    quizAttempts,
  };
}
export type ParticipantStatistics = NonNullable<
  ReturnType<typeof buildParticipantStatistics>
> & { environment: string; updatedAt: string };
