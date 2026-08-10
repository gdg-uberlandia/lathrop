import { CURRENT_EVENT_ID } from "@/helpers/event";
import {
  Speaker,
  SpeakerInput,
  speakerFieldsSchema,
  speakerInputSchema,
} from "@/models/speaker";
import { db } from "@/utils/db/index";
import { Timestamp } from "firebase-admin/firestore";

const SPEAKERS_COLLECTION = `speakers${process.env.DEV_MODE ? "_test" : ""}`;

const parseSpeaker = (id: string, value: FirebaseFirestore.DocumentData) => {
  return speakerFieldsSchema.parse({
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
};

export const getAllSpeakers = async (): Promise<Speaker[]> => {
  const snapshot = await db
    .collection(SPEAKERS_COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();

  return snapshot.docs
    .map((doc) => parseSpeaker(doc.id, doc.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
};

export const createSpeaker = async (input: SpeakerInput): Promise<Speaker> => {
  const data = speakerInputSchema.parse(input);
  const docRef = db.collection(SPEAKERS_COLLECTION).doc(data.id);
  const existing = await docRef.get();

  if (existing.exists) {
    throw new Error(`Palestrante com id ${data.id} já existe.`);
  }

  const now = new Date();
  const speaker = speakerFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  });
  await docRef.create(speaker);
  return speaker;
};

export const getSpeakerById = async (speakerId: string): Promise<Speaker> => {
  const doc = await db.collection(SPEAKERS_COLLECTION).doc(speakerId).get();

  if (!doc.exists) {
    throw new Error(`Palestrante com id ${speakerId} não encontrado.`);
  }

  const speaker = parseSpeaker(doc.id, doc.data()!);
  if (speaker.eventId !== CURRENT_EVENT_ID) {
    throw new Error(`Palestrante com id ${speakerId} não encontrado.`);
  }
  return speaker;
};

export const updateSpeaker = async (input: SpeakerInput): Promise<Speaker> => {
  const data = speakerInputSchema.parse(input);
  const current = await getSpeakerById(data.id);
  const speaker = speakerFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: current.createdAt,
    updatedAt: new Date(),
  });
  await db.collection(SPEAKERS_COLLECTION).doc(data.id).set(speaker);
  return speaker;
};

export const deleteSpeaker = async (speakerId: string): Promise<string> => {
  await getSpeakerById(speakerId);
  const linkedTalk = await db
    .collection(`talks${process.env.DEV_MODE ? "_test" : ""}`)
    .where("speakerIds", "array-contains", speakerId)
    .get();

  if (
    linkedTalk.docs.some(
      (document) => document.data().eventId === CURRENT_EVENT_ID,
    )
  ) {
    throw new Error("Remova o palestrante das palestras antes de excluí-lo.");
  }

  await db.collection(SPEAKERS_COLLECTION).doc(speakerId).delete();
  return speakerId;
};
