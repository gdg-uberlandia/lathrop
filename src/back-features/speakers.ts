import { CURRENT_EVENT_ID } from "@/helpers/event";
import { Speaker, speakerFieldsSchema } from "@/contracts/speaker";
import { db } from "@/utils/db/index";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { Timestamp } from "firebase-admin/firestore";

import {
  adminSpeakerInputSchema,
  type AdminSpeaker,
  type AdminSpeakerInput,
} from "@/contracts/speaker-publication";

const PUBLICATIONS_COLLECTION = getFirestoreCollectionName(
  "speakerPublications",
);
const SPEAKERS_COLLECTION = getFirestoreCollectionName("speakers");
const TALKS_COLLECTION = getFirestoreCollectionName("talks");

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

export const createSpeaker = async (
  input: AdminSpeakerInput,
): Promise<AdminSpeaker> => {
  const { publishAt = null, ...data } = adminSpeakerInputSchema.parse(input);
  const docRef = db.collection(SPEAKERS_COLLECTION).doc(data.id);
  const publicationRef = db.collection(PUBLICATIONS_COLLECTION).doc(data.id);
  const now = new Date();
  const speaker = speakerFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  });
  await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(docRef);
    if (existing.exists)
      throw new Error(`Palestrante com id ${data.id} já existe.`);
    transaction.create(docRef, speaker);
    if (publishAt)
      transaction.set(publicationRef, {
        speakerId: data.id,
        eventId: CURRENT_EVENT_ID,
        publishAt,
        updatedAt: now,
      });
    else transaction.delete(publicationRef);
  });
  return { ...speaker, publishAt };
};

export const getAllAdminSpeakers = async (): Promise<AdminSpeaker[]> => {
  const [speakers, publications] = await Promise.all([
    getAllSpeakers(),
    db
      .collection(PUBLICATIONS_COLLECTION)
      .where("eventId", "==", CURRENT_EVENT_ID)
      .get(),
  ]);
  const dates = new Map(
    publications.docs.map((doc) => [doc.id, doc.data().publishAt as string]),
  );
  return speakers.map((speaker) => ({
    ...speaker,
    publishAt: dates.get(speaker.id) ?? null,
  }));
};

export const getAdminSpeakerById = async (
  id: string,
): Promise<AdminSpeaker> => {
  const [speaker, publication] = await Promise.all([
    getSpeakerById(id),
    db.collection(PUBLICATIONS_COLLECTION).doc(id).get(),
  ]);
  const value = publication.data();
  return {
    ...speaker,
    publishAt:
      value?.eventId === CURRENT_EVENT_ID ? (value.publishAt ?? null) : null,
  };
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

export const getSpeakersByIds = async (
  speakerIds: string[],
): Promise<Speaker[]> => {
  const ids = [...new Set(speakerIds)];
  if (!ids.length) return [];
  const documents = await db.getAll(
    ...ids.map((id) => db.collection(SPEAKERS_COLLECTION).doc(id)),
  );
  return documents.flatMap((document) => {
    if (!document.exists) return [];
    const speaker = parseSpeaker(document.id, document.data()!);
    return speaker.eventId === CURRENT_EVENT_ID ? [speaker] : [];
  });
};

export const updateSpeaker = async (
  input: AdminSpeakerInput,
): Promise<AdminSpeaker> => {
  const { publishAt, ...data } = adminSpeakerInputSchema.parse(input);
  const speakerRef = db.collection(SPEAKERS_COLLECTION).doc(data.id);
  const publicationRef = db.collection(PUBLICATIONS_COLLECTION).doc(data.id);
  return db.runTransaction(async (transaction) => {
    const [currentDoc, publicationDoc] = await Promise.all([
      transaction.get(speakerRef),
      transaction.get(publicationRef),
    ]);
    if (!currentDoc.exists || currentDoc.data()?.eventId !== CURRENT_EVENT_ID) {
      throw new Error(`Palestrante com id ${data.id} não encontrado.`);
    }
    const current = parseSpeaker(currentDoc.id, currentDoc.data()!);
    const publication = publicationDoc.data();
    const nextPublishAt = data.isVisible
      ? null
      : publishAt === undefined
        ? publication?.eventId === CURRENT_EVENT_ID
          ? (publication.publishAt ?? null)
          : null
        : publishAt;
    const now = new Date();
    const speaker = speakerFieldsSchema.parse({
      ...data,
      eventId: CURRENT_EVENT_ID,
      createdAt: current.createdAt,
      updatedAt: now,
    });
    transaction.set(speakerRef, speaker);
    if (nextPublishAt)
      transaction.set(publicationRef, {
        speakerId: data.id,
        eventId: CURRENT_EVENT_ID,
        publishAt: nextPublishAt,
        updatedAt: now,
      });
    else transaction.delete(publicationRef);
    return { ...speaker, publishAt: nextPublishAt };
  });
};

export const deleteSpeaker = async (speakerId: string): Promise<string> => {
  await getSpeakerById(speakerId);
  const linkedTalk = await db
    .collection(TALKS_COLLECTION)
    .where("speakerIds", "array-contains", speakerId)
    .get();

  if (
    linkedTalk.docs.some(
      (document) => document.data().eventId === CURRENT_EVENT_ID,
    )
  ) {
    throw new Error("Remova o palestrante das palestras antes de excluí-lo.");
  }

  const batch = db.batch();
  batch.delete(db.collection(SPEAKERS_COLLECTION).doc(speakerId));
  batch.delete(db.collection(PUBLICATIONS_COLLECTION).doc(speakerId));
  await batch.commit();
  return speakerId;
};
