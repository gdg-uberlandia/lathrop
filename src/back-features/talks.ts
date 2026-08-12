import { CURRENT_EVENT_ID } from "@/helpers/event";
import {
  Talk,
  TalkCreate,
  TalkUpdate,
  talkCreateSchema,
  talkFieldsSchema,
  talkUpdateSchema,
  normalizeStoredTalkFormat,
} from "@/contracts/talk";
import { db } from "@/utils/db/index";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { Timestamp } from "firebase-admin/firestore";

const TALKS_COLLECTION = getFirestoreCollectionName("talks");
const SPEAKERS_COLLECTION = getFirestoreCollectionName("speakers");
const SCHEDULE_COLLECTION = getFirestoreCollectionName("schedule");

const parseTalk = (id: string, value: FirebaseFirestore.DocumentData) =>
  talkFieldsSchema.parse({
    ...value,
    id,
    format: normalizeStoredTalkFormat(value.format),
    createdAt:
      value.createdAt instanceof Timestamp
        ? value.createdAt.toDate()
        : value.createdAt,
    updatedAt:
      value.updatedAt instanceof Timestamp
        ? value.updatedAt.toDate()
        : value.updatedAt,
  });

const validateSpeakers = async (speakerIds: string[]) => {
  const snapshots = await Promise.all(
    speakerIds.map((id) => db.collection(SPEAKERS_COLLECTION).doc(id).get()),
  );
  const invalidSpeaker = snapshots.find(
    (snapshot) =>
      !snapshot.exists || snapshot.data()?.eventId !== CURRENT_EVENT_ID,
  );
  if (invalidSpeaker) {
    throw new Error("A palestra possui um palestrante inválido.");
  }
};

export const getAllTalks = async (): Promise<Talk[]> => {
  const snapshot = await db
    .collection(TALKS_COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .map((doc) => parseTalk(doc.id, doc.data()))
    .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
};

export const getTalkById = async (talkId: string): Promise<Talk> => {
  const doc = await db.collection(TALKS_COLLECTION).doc(talkId).get();
  if (!doc.exists) throw new Error(`Palestra com id ${talkId} não encontrada.`);
  const talk = parseTalk(doc.id, doc.data()!);
  if (talk.eventId !== CURRENT_EVENT_ID) {
    throw new Error(`Palestra com id ${talkId} não encontrada.`);
  }
  return talk;
};

export const getTalksByIds = async (talkIds: string[]): Promise<Talk[]> => {
  const ids = [...new Set(talkIds)];
  if (!ids.length) return [];
  const documents = await db.getAll(
    ...ids.map((id) => db.collection(TALKS_COLLECTION).doc(id)),
  );
  return documents.flatMap((document) => {
    if (!document.exists) return [];
    const talk = parseTalk(document.id, document.data()!);
    return talk.eventId === CURRENT_EVENT_ID ? [talk] : [];
  });
};

export const createTalk = async (input: TalkCreate): Promise<Talk> => {
  const data = talkCreateSchema.parse(input);
  await validateSpeakers(data.speakerIds);
  const ref = db.collection(TALKS_COLLECTION).doc(data.id);
  if ((await ref.get()).exists) {
    throw new Error(`Palestra com id ${data.id} já existe.`);
  }
  const now = new Date();
  const talk = talkFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  });
  await ref.create(talk);
  return talk;
};

export const updateTalk = async (input: TalkUpdate): Promise<Talk> => {
  const data = talkUpdateSchema.parse(input);
  const current = await getTalkById(data.id);
  if (current.isActive && !data.isActive) {
    const linkedSchedule = await db
      .collection(SCHEDULE_COLLECTION)
      .where("activity.talkId", "==", data.id)
      .get();
    if (
      linkedSchedule.docs.some(
        (document) => document.data().eventId === CURRENT_EVENT_ID,
      )
    ) {
      throw new Error("Remova a palestra da programação antes de desativá-la.");
    }
  }
  await validateSpeakers(data.speakerIds);
  const talk = talkFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: current.createdAt,
    updatedAt: new Date(),
  });
  await db.collection(TALKS_COLLECTION).doc(data.id).set(talk);
  return talk;
};

export const deleteTalk = async (talkId: string): Promise<string> => {
  await getTalkById(talkId);
  const linkedSchedule = await db
    .collection(SCHEDULE_COLLECTION)
    .where("activity.talkId", "==", talkId)
    .get();
  if (
    linkedSchedule.docs.some(
      (document) => document.data().eventId === CURRENT_EVENT_ID,
    )
  ) {
    throw new Error("Remova a palestra da programação antes de excluí-la.");
  }
  await db.collection(TALKS_COLLECTION).doc(talkId).delete();
  return talkId;
};
