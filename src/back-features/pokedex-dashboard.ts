import { CURRENT_EVENT_ID } from "@/helpers/event";
import { admin, db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import {
  buildPokedexDashboard,
  type DashboardSource,
  type DashboardFilters,
} from "@/lib/pokedex-dashboard";

// Project only analytics fields: comments, QR tokens and other profile data stay out.
const fields: Record<string, string[]> = {
  profiles: [
    "displayName",
    "email",
    "accessRoles",
    "createdAt",
    "onboardingCompleted",
    "xp",
    "ticketBalance",
  ],
  activityCompletions: [
    "participantId",
    "activityId",
    "activityType",
    "xpAwarded",
    "completedAt",
  ],
  connections: [
    "participantIds",
    "status",
    "acceptedAt",
    "xpAwardedPerParticipant",
  ],
  "talk-ratings": [
    "participantId",
    "talkId",
    "completedAt",
    "speakerRating",
    "contentRating",
    "comprehensionRating",
    "xpAwarded",
  ],
  ticketTransactions: [
    "participantId",
    "type",
    "ticketDelta",
    "referenceId",
    "referenceType",
    "createdAt",
  ],
  rewardRedemptions: ["participantId", "rewardId", "quantity", "ticketsSpent"],
  rewards: ["name", "stock", "active"],
  companies: ["name"],
  missions: ["title", "name"],
  tags: ["name"],
  talks: ["title"],
  raffles: ["prizeName", "status", "winnerId", "winnerName", "drawnAt"],
  missionAttempts: ["participantId", "outcome", "updatedAt"],
};
let cached:
  | { source: DashboardSource; updatedAt: string; expires: number; key: string }
  | undefined;
let pending:
  | { key: string; promise: Promise<NonNullable<typeof cached>> }
  | undefined;
export async function getPokedexDashboard(filters: DashboardFilters) {
  const key = `${admin.app().options.projectId ?? "default"}:${CURRENT_EVENT_ID}:${getFirestoreCollectionName("profiles")}`;
  if (!cached || cached.key !== key || cached.expires <= Date.now()) {
    if (!pending || pending.key !== key) {
      const promise = (async () => {
        const entries = await Promise.all(
          Object.entries(fields).map(async ([name, selection]) => {
            const snapshot = await db
              .collection(getFirestoreCollectionName(name))
              .where("eventId", "==", CURRENT_EVENT_ID)
              .select(...selection)
              .get();
            return [
              name,
              snapshot.docs.map((d) => ({ ...d.data(), id: d.id })),
            ] as const;
          }),
        );
        return {
          source: Object.fromEntries(entries),
          updatedAt: new Date().toISOString(),
          expires: Date.now() + 300_000,
          key,
        };
      })();
      pending = { key, promise };
    }
    const request = pending;
    try {
      cached = await request.promise;
    } finally {
      if (pending === request) pending = undefined;
    }
  }
  return {
    ...buildPokedexDashboard(cached.source, filters),
    updatedAt: cached.updatedAt,
    eventId: CURRENT_EVENT_ID,
    environment: getFirestoreCollectionName("profiles").startsWith("test_")
      ? "Teste"
      : "Produção",
  };
}
