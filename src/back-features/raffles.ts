import { Timestamp } from "firebase-admin/firestore";
import {
  Raffle,
  RaffleInput,
  raffleFieldsSchema,
  raffleInputSchema,
} from "@/contracts/raffle";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const COLLECTION = getFirestoreCollectionName("raffles");
const parse = (id: string, value: FirebaseFirestore.DocumentData) =>
  raffleFieldsSchema.parse({
    ...value,
    id,
    createdAt:
      value.createdAt instanceof Timestamp
        ? value.createdAt.toDate()
        : value.createdAt,
    updatedAt:
      value.updatedAt instanceof Timestamp
        ? value.updatedAt.toDate()
        : value.updatedAt,
    drawnAt:
      value.drawnAt instanceof Timestamp
        ? value.drawnAt.toDate()
        : value.drawnAt,
  });

export async function getAllRaffles(): Promise<Raffle[]> {
  const snapshot = await db
    .collection(COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .map((doc) => parse(doc.id, doc.data()))
    .sort((a, b) => a.order - b.order);
}
export async function getRaffleById(id: string): Promise<Raffle> {
  const document = await db.collection(COLLECTION).doc(id).get();
  if (!document.exists) throw new Error("Prêmio não encontrado.");
  const raffle = parse(document.id, document.data()!);
  if (raffle.eventId !== CURRENT_EVENT_ID)
    throw new Error("Prêmio não encontrado.");
  return raffle;
}
export async function createRaffle(input: RaffleInput): Promise<Raffle> {
  const data = raffleInputSchema.parse(input);
  const reference = db.collection(COLLECTION).doc(data.id);
  if ((await reference.get()).exists)
    throw new Error("Já existe um prêmio com este ID.");
  const now = new Date();
  const raffle = raffleFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    status: "pending",
    currentAttemptId: null,
    currentCandidateId: null,
    currentCandidateName: null,
    winnerId: null,
    winnerName: null,
    eligibleParticipantCount: null,
    eligibleTicketTotal: null,
    randomOffset: null,
    drawnAt: null,
    drawnBy: null,
    createdAt: now,
    updatedAt: now,
  });
  await reference.create(raffle);
  return raffle;
}
export async function updateRaffle(input: RaffleInput): Promise<Raffle> {
  const data = raffleInputSchema.parse(input);
  const current = await getRaffleById(data.id);
  const raffle = raffleFieldsSchema.parse({
    ...current,
    ...data,
    updatedAt: new Date(),
  });
  await db.collection(COLLECTION).doc(data.id).set(raffle);
  return raffle;
}
export async function deleteRaffle(id: string) {
  const current = await getRaffleById(id);
  if (current.status !== "pending")
    throw new Error(
      "Um sorteio em andamento ou concluído não pode ser excluído.",
    );
  await db.collection(COLLECTION).doc(id).delete();
  return id;
}
