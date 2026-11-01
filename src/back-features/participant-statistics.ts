import { CURRENT_EVENT_ID } from "@/helpers/event";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { buildParticipantStatistics } from "@/lib/participant-statistics";
import type { DashboardSource } from "@/lib/pokedex-dashboard";

export async function getParticipantStatistics(participantId: string) {
  const collection = (name: string) =>
    db.collection(getFirestoreCollectionName(name));
  const profile = await collection("profiles").doc(participantId).get();
  if (!profile.exists || profile.data()?.eventId !== CURRENT_EVENT_ID)
    return null;
  const source: DashboardSource = {};
  const owned: Record<string, string[]> = {
    activityCompletions: [
      "participantId",
      "eventId",
      "activityId",
      "activityType",
      "xpAwarded",
      "completedAt",
    ],
    rewardRedemptions: [
      "participantId",
      "eventId",
      "rewardId",
      "quantity",
      "ticketsSpent",
      "firstRedeemedAt",
      "lastRedeemedAt",
    ],
    "talk-ratings": [
      "participantId",
      "eventId",
      "talkId",
      "speakerRating",
      "contentRating",
      "comprehensionRating",
      "xpAwarded",
      "completedAt",
    ],
    ticketTransactions: [
      "participantId",
      "eventId",
      "type",
      "ticketDelta",
      "referenceType",
      "referenceId",
      "convertedXp",
      "createdAt",
    ],
    raffleAttempts: [
      "participantId",
      "eventId",
      "raffleId",
      "status",
      "selectedAt",
      "resolvedAt",
    ],
    missionAttempts: [
      "participantId",
      "eventId",
      "missionId",
      "attempts",
      "outcome",
      "lastScore",
      "questionCount",
      "updatedAt",
    ],
  };
  await Promise.all([
    ...Object.entries(owned).map(async ([name, fields]) => {
      // Single-field participant queries avoid requiring additional composite indexes.
      const snapshot = await collection(name)
        .where("participantId", "==", participantId)
        .select(...fields)
        .get();
      source[name] = snapshot.docs
        .filter((d) => d.data().eventId === CURRENT_EVENT_ID)
        .map((d) => ({ ...d.data(), id: d.id }));
    }),
    ...["missions", "companies", "tags", "talks", "rewards", "raffles"].map(
      async (name) => {
        const fields =
          name === "raffles"
            ? ["eventId", "prizeName", "winnerId", "status", "drawnAt"]
            : ["eventId", "name", "title"];
        const snapshot = await collection(name)
          .where("eventId", "==", CURRENT_EVENT_ID)
          .select(...fields)
          .get();
        source[name] = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
      },
    ),
    (async () => {
      const snapshot = await collection("connections")
        .where("participantIds", "array-contains", participantId)
        .select(
          "eventId",
          "participantIds",
          "status",
          "acceptedAt",
          "lastRequestedAt",
          "createdAt",
          "xpAwardedPerParticipant",
        )
        .get();
      source.connections = snapshot.docs
        .filter((d) => d.data().eventId === CURRENT_EVENT_ID)
        .map((d) => ({ ...d.data(), id: d.id }));
    })(),
  ]);
  const result = buildParticipantStatistics(
    { ...profile.data(), id: profile.id },
    source,
    CURRENT_EVENT_ID,
  );
  return result
    ? {
        ...result,
        environment: getFirestoreCollectionName("profiles").startsWith("test_")
          ? "Teste"
          : "Produção",
        updatedAt: new Date().toISOString(),
      }
    : null;
}
