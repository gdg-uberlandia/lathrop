import { Timestamp } from "firebase-admin/firestore";
import {
  ScheduleEntry,
  ScheduleInput,
  ScheduleBlockInput,
  SCHEDULE_TRACKS,
  getScheduleTrackOrder,
  scheduleFieldsSchema,
  scheduleInputSchema,
  scheduleBlockInputSchema,
} from "@/contracts/schedule";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import configValues from "@/helpers/config";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { Talk } from "@/contracts/talk";
import { getTalkById } from "@/back-features/talks";

const COLLECTION = getFirestoreCollectionName("schedule");
const toDate = (value: unknown) =>
  value instanceof Timestamp ? value.toDate() : value;
const parse = (id: string, value: FirebaseFirestore.DocumentData) =>
  scheduleFieldsSchema.parse({
    ...value,
    id,
    startAt: toDate(value.startAt),
    endAt: toDate(value.endAt),
    createdAt: toDate(value.createdAt),
    updatedAt: toDate(value.updatedAt),
  });
async function validateTalk(input: ScheduleInput): Promise<Talk | null> {
  if (input.activity.type === "break") return null;
  const talk = await getTalkById(input.activity.talkId).catch(() => null);
  if (!talk || talk.eventId !== CURRENT_EVENT_ID)
    throw new Error("Selecione uma palestra válida deste evento.");
  if (!talk.isActive)
    throw new Error("Apenas palestras ativas podem entrar na programação.");
  return talk;
}
async function validateConflict(input: ScheduleInput, talk: Talk | null) {
  const interval = resolveInterval(input);
  const snapshot = await db
    .collection(COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  const existing = snapshot.docs
    .filter((document) => document.id !== input.id)
    .map((document) => parse(document.id, document.data()));
  if (
    talk &&
    existing.some(
      (item) =>
        item.activity.type !== "break" && item.activity.talkId === talk.id,
    )
  ) {
    throw new Error("Esta palestra já foi adicionada à programação.");
  }
  const overlapping = existing.filter(
    (item) => interval.startAt < item.endAt && item.startAt < interval.endAt,
  );
  const trackConflict = overlapping.some(
    (item) =>
      item.track === null || input.track === null || item.track === input.track,
  );
  if (trackConflict)
    throw new Error("Já existe uma atividade conflitante neste intervalo.");
  if (!talk) return;
  const overlappingTalkIds = overlapping.flatMap((item) =>
    item.activity.type === "break" ? [] : [item.activity.talkId],
  );
  const overlappingTalks = await Promise.all(
    [...new Set(overlappingTalkIds)].map((talkId) => getTalkById(talkId)),
  );
  const candidateSpeakers = new Set(talk.speakerIds);
  if (
    overlappingTalks.some((scheduledTalk) =>
      scheduledTalk.speakerIds.some((speakerId) =>
        candidateSpeakers.has(speakerId),
      ),
    )
  ) {
    throw new Error(
      "Um palestrante desta palestra já está alocado neste horário.",
    );
  }
}
function resolveInterval(input: ScheduleInput) {
  const eventDate = String(configValues.eventDate).slice(0, 10);
  return {
    startAt: new Date(`${eventDate}T${input.startTime}:00-03:00`),
    endAt: new Date(`${eventDate}T${input.endTime}:00-03:00`),
  };
}
function toStoredFields(input: ScheduleInput) {
  return {
    id: input.id,
    ...resolveInterval(input),
    track: input.track,
    order: input.track ? getScheduleTrackOrder(input.track) : null,
    activity: input.activity,
    active: input.active,
  };
}
export async function getSchedule(): Promise<ScheduleEntry[]> {
  const snapshot = await db
    .collection(COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .map((doc) => parse(doc.id, doc.data()))
    .sort(
      (a, b) =>
        a.startAt.getTime() - b.startAt.getTime() ||
        (a.order ?? -1) - (b.order ?? -1),
    );
}
export async function readSchedule(id: string): Promise<ScheduleEntry> {
  const document = await db.collection(COLLECTION).doc(id).get();
  if (!document.exists) throw new Error("Item da programação não encontrado.");
  const item = parse(document.id, document.data()!);
  if (item.eventId !== CURRENT_EVENT_ID)
    throw new Error("Item da programação não encontrado.");
  return item;
}
export async function createSchedule(
  input: ScheduleInput,
): Promise<ScheduleEntry> {
  const data = scheduleInputSchema.parse(input);
  const talk = await validateTalk(data);
  await validateConflict(data, talk);
  const reference = db.collection(COLLECTION).doc(data.id);
  if ((await reference.get()).exists)
    throw new Error("Já existe um item com este ID.");
  const now = new Date();
  const item = scheduleFieldsSchema.parse({
    ...toStoredFields(data),
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  });
  await reference.create(item);
  return item;
}
export async function updateSchedule(
  input: ScheduleInput,
): Promise<ScheduleEntry> {
  const data = scheduleInputSchema.parse(input);
  const talk = await validateTalk(data);
  await validateConflict(data, talk);
  const current = await readSchedule(data.id);
  const item = scheduleFieldsSchema.parse({
    ...toStoredFields(data),
    eventId: CURRENT_EVENT_ID,
    createdAt: current.createdAt,
    updatedAt: new Date(),
  });
  await db.collection(COLLECTION).doc(data.id).set(item);
  return item;
}
export async function deleteSchedule(id: string) {
  await readSchedule(id);
  await db.collection(COLLECTION).doc(id).delete();
  return id;
}

export async function createScheduleBlock(
  input: ScheduleBlockInput,
): Promise<ScheduleEntry[]> {
  const data = scheduleBlockInputSchema.parse(input);
  const entries: ScheduleInput[] = SCHEDULE_TRACKS.map((track) => ({
    id: db.collection(COLLECTION).doc().id,
    startTime: data.startTime,
    endTime: data.endTime,
    track: track.value,
    activity: { type: "talk", talkId: data.talks[track.value] },
    active: data.active,
  }));
  const talks = await Promise.all(entries.map(validateTalk));
  const speakerIds = new Set<string>();
  for (const talk of talks) {
    if (!talk) continue;
    for (const speakerId of talk.speakerIds) {
      if (speakerIds.has(speakerId))
        throw new Error(
          "Um palestrante foi selecionado em mais de uma trilha neste bloco.",
        );
      speakerIds.add(speakerId);
    }
  }
  await Promise.all(
    entries.map((entry, index) => validateConflict(entry, talks[index])),
  );
  const now = new Date();
  const documents = entries.map((entry) =>
    scheduleFieldsSchema.parse({
      ...toStoredFields(entry),
      eventId: CURRENT_EVENT_ID,
      createdAt: now,
      updatedAt: now,
    }),
  );
  const batch = db.batch();
  documents.forEach((document) =>
    batch.create(db.collection(COLLECTION).doc(document.id), document),
  );
  await batch.commit();
  return documents;
}
