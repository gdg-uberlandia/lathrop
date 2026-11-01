import { Timestamp } from "firebase-admin/firestore";
import {
  rewardFieldsSchema,
  rewardDeleteSchema,
  rewardInputSchema,
  rewardUpdateSchema,
  Reward,
} from "@/contracts/reward";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const collection = getFirestoreCollectionName("rewards");
const idSchema = rewardInputSchema.shape.id;
const parse = (id: string, value: FirebaseFirestore.DocumentData): Reward =>
  rewardFieldsSchema.parse({
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
  });
export async function getRewards() {
  const snapshot = await db
    .collection(collection)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .filter((doc) => !doc.data().deletedAt)
    .map((doc) => parse(doc.id, doc.data()))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pt-BR"));
}
export async function getReward(id: string) {
  const snapshot = await db
    .collection(collection)
    .doc(idSchema.parse(id))
    .get();
  if (
    !snapshot.exists ||
    snapshot.data()?.eventId !== CURRENT_EVENT_ID ||
    snapshot.data()?.deletedAt
  )
    throw new Error("Brinde não encontrado neste evento.");
  return parse(snapshot.id, snapshot.data()!);
}
export async function createReward(input: unknown) {
  const data = rewardInputSchema.parse(input);
  const now = Timestamp.now();
  const ref = db.collection(collection).doc(data.id);
  // Keep the document format consumed by the Pokédex (ID comes from the document).
  const { id, ...fields } = data;
  const document = {
    ...fields,
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  };
  await ref.create(document);
  return parse(id, document);
}
export async function updateReward(input: unknown) {
  const { expectedUpdatedAt, id, ...fields } = rewardUpdateSchema.parse(input);
  const ref = db.collection(collection).doc(id);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (
      !snapshot.exists ||
      snapshot.data()?.eventId !== CURRENT_EVENT_ID ||
      snapshot.data()?.deletedAt
    )
      throw new Error("Brinde não encontrado neste evento.");
    const current = parse(snapshot.id, snapshot.data()!);
    if (current.updatedAt.toISOString() !== expectedUpdatedAt)
      throw new Error(
        "Este brinde foi atualizado ou resgatado enquanto você editava. Recarregue a página para conferir o estoque atual antes de salvar.",
      );
    const updatedAt = Timestamp.now();
    transaction.update(ref, { ...fields, updatedAt });
    return parse(id, { ...snapshot.data(), ...fields, updatedAt });
  });
}

/** Remove from the catalog while keeping names and redemption references auditable. */
export async function deleteReward(input: unknown, operatorId: string) {
  const { id, expectedUpdatedAt } = rewardDeleteSchema.parse(input);
  const ref = db.collection(collection).doc(id);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists || snapshot.data()?.eventId !== CURRENT_EVENT_ID)
      throw new Error("Brinde não encontrado neste evento.");
    const data = snapshot.data()!;
    if (data.deletedAt) return id;
    const current = parse(snapshot.id, data);
    if (current.updatedAt.toISOString() !== expectedUpdatedAt)
      throw new Error(
        "Este brinde foi alterado ou resgatado. Recarregue a lista antes de excluir.",
      );
    const now = Timestamp.now();
    transaction.update(ref, {
      active: false,
      deletedAt: now,
      deletedBy: operatorId,
      updatedAt: now,
    });
    return id;
  });
}
