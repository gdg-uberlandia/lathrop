import { Timestamp } from "firebase-admin/firestore";
import {
  ScheduleEntry,
  ScheduleInput,
  getScheduleTrackOrder,
  scheduleFieldsSchema,
  scheduleInputSchema,
} from "@/contracts/schedule";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import configValues from "@/helpers/config";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const COLLECTION = getFirestoreCollectionName("schedule");
const TALKS_COLLECTION = getFirestoreCollectionName("talks");
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
async function validateTalk(input: ScheduleInput) {
  if (input.activity.type !== "talk") return;
  const talk = await db
    .collection(TALKS_COLLECTION)
    .doc(input.activity.talkId)
    .get();
  if (!talk.exists || talk.data()?.eventId !== CURRENT_EVENT_ID)
    throw new Error("Selecione uma palestra válida deste evento.");
}
async function validateConflict(input: ScheduleInput) {
  const interval = resolveInterval(input);
  const snapshot = await db
    .collection(COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  const conflict = snapshot.docs
    .filter((document) => document.id !== input.id)
    .map((document) => parse(document.id, document.data()))
    .some(
      (item) =>
        item.track === input.track &&
        interval.startAt < item.endAt &&
        item.startAt < interval.endAt,
    );
  if (conflict)
    throw new Error("Já existe uma atividade nesta sala e intervalo.");
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
    order: getScheduleTrackOrder(input.track),
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
      (a, b) => a.startAt.getTime() - b.startAt.getTime() || a.order - b.order,
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
  await validateTalk(data);
  await validateConflict(data);
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
  await validateTalk(data);
  await validateConflict(data);
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
