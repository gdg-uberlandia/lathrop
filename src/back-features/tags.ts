import { Timestamp } from "firebase-admin/firestore";
import {
  Tag,
  TagInput,
  tagFieldsSchema,
  tagInputSchema,
} from "@/contracts/tag";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const COLLECTION = getFirestoreCollectionName("tags");
const parse = (id: string, value: FirebaseFirestore.DocumentData) =>
  tagFieldsSchema.parse({
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

export async function getAllTags(): Promise<Tag[]> {
  const snapshot = await db
    .collection(COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .map((doc) => parse(doc.id, doc.data()))
    .sort((a, b) => a.order - b.order);
}
export async function getTagById(id: string): Promise<Tag> {
  const document = await db.collection(COLLECTION).doc(id).get();
  if (!document.exists) throw new Error("Tag não encontrada.");
  const tag = parse(document.id, document.data()!);
  if (tag.eventId !== CURRENT_EVENT_ID) throw new Error("Tag não encontrada.");
  return tag;
}
export async function createTag(input: TagInput): Promise<Tag> {
  const data = tagInputSchema.parse(input);
  const reference = db.collection(COLLECTION).doc(data.id);
  if ((await reference.get()).exists)
    throw new Error("Já existe uma tag com este ID.");
  const now = new Date();
  const tag = tagFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  });
  await reference.create(tag);
  return tag;
}
export async function updateTag(input: TagInput): Promise<Tag> {
  const data = tagInputSchema.parse(input);
  const current = await getTagById(data.id);
  const tag = tagFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: current.createdAt,
    updatedAt: new Date(),
  });
  await db.collection(COLLECTION).doc(data.id).set(tag);
  return tag;
}
export async function deleteTag(id: string) {
  await getTagById(id);
  await db.collection(COLLECTION).doc(id).delete();
  return id;
}
