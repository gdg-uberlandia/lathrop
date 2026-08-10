import { CURRENT_EVENT_ID } from "@/helpers/event";
import {
  Talk,
  TalkInput,
  talkFieldsSchema,
  talkInputSchema,
} from "@/models/talk";
import { db } from "@/utils/db/index";
import { Timestamp } from "firebase-admin/firestore";

const TALKS_COLLECTION = `talks${process.env.DEV_MODE ? "_test" : ""}`;
const SPEAKERS_COLLECTION = `speakers${process.env.DEV_MODE ? "_test" : ""}`;

const parseTalk = (id: string, value: FirebaseFirestore.DocumentData) =>
  talkFieldsSchema.parse({
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

export const createTalk = async (input: TalkInput): Promise<Talk> => {
  const data = talkInputSchema.parse(input);
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

export const updateTalk = async (input: TalkInput): Promise<Talk> => {
  const data = talkInputSchema.parse(input);
  const current = await getTalkById(data.id);
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
  await db.collection(TALKS_COLLECTION).doc(talkId).delete();
  return talkId;
};
