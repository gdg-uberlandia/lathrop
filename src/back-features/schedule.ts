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
  scheduleVisibilityInputSchema,
} from "@/contracts/schedule";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import configValues from "@/helpers/config";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { Talk } from "@/contracts/talk";
import { getTalkById } from "@/back-features/talks";
import { getSpeakerById } from "@/back-features/speakers";

const COLLECTION = getFirestoreCollectionName("schedule");
const formatTime = (value: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(value);
const trackLabel = (track: ScheduleEntry["track"]) =>
  track
    ? `trilha ${SCHEDULE_TRACKS.find((item) => item.value === track)?.label ?? track}`
    : "atividade geral";
const intervalLabel = (item: ScheduleEntry) =>
  `${formatTime(item.startAt)}–${formatTime(item.endAt)}`;
type ConflictContext = {
  existing: ScheduleEntry[];
  talks: Map<string, Promise<Talk>>;
};
const cachedTalk = (talkId: string, cache?: Map<string, Promise<Talk>>) => {
  if (!cache) return getTalkById(talkId);
  const current = cache.get(talkId);
  if (current) return current;
  const request = getTalkById(talkId);
  cache.set(talkId, request);
  return request;
};
async function activityTitle(
  item: ScheduleEntry,
  cache?: Map<string, Promise<Talk>>,
) {
  if (item.activity.type === "break") return item.activity.title;
  return cachedTalk(item.activity.talkId, cache)
    .then((scheduledTalk) => scheduledTalk.title)
    .catch(() => "atividade já programada");
}
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
async function getExistingSchedule(excludeId?: string) {
  const snapshot = await db
    .collection(COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .filter((document) => document.id !== excludeId)
    .map((document) => parse(document.id, document.data()));
}
async function getPotentialConflicts(input: ScheduleInput, talk: Talk | null) {
  const interval = resolveInterval(input);
  const eventDate = String(configValues.eventDate).slice(0, 10);
  const eventDayStart = new Date(`${eventDate}T00:00:00-03:00`);
  const overlappingRequest = db
    .collection(COLLECTION)
    .where("startAt", ">=", eventDayStart)
    .where("startAt", "<", interval.endAt)
    .get();
  const duplicatedRequest = talk
    ? db.collection(COLLECTION).where("activity.talkId", "==", talk.id).get()
    : null;
  const [overlappingSnapshot, duplicatedSnapshot] = await Promise.all([
    overlappingRequest,
    duplicatedRequest,
  ]);
  const documents = new Map(
    [...overlappingSnapshot.docs, ...(duplicatedSnapshot?.docs ?? [])].map(
      (document) => [document.id, document],
    ),
  );
  return [...documents.values()].flatMap((document) => {
    if (document.id === input.id) return [];
    const item = parse(document.id, document.data());
    if (item.eventId !== CURRENT_EVENT_ID) return [];
    const duplicated =
      talk &&
      item.activity.type !== "break" &&
      item.activity.talkId === talk.id;
    const overlaps =
      interval.startAt < item.endAt && item.startAt < interval.endAt;
    return duplicated || overlaps ? [item] : [];
  });
}
async function validateConflict(
  input: ScheduleInput,
  talk: Talk | null,
  context?: ConflictContext,
) {
  const interval = resolveInterval(input);
  const existing =
    context?.existing ?? (await getPotentialConflicts(input, talk));
  const duplicatedTalk = talk
    ? existing.find(
        (item) =>
          item.activity.type !== "break" && item.activity.talkId === talk.id,
      )
    : null;
  if (duplicatedTalk) {
    throw new Error(
      `A palestra “${talk!.title}” já está programada em ${intervalLabel(duplicatedTalk)}, como ${trackLabel(duplicatedTalk.track)}.`,
    );
  }
  const overlapping = existing.filter(
    (item) => interval.startAt < item.endAt && item.startAt < interval.endAt,
  );
  const trackConflict = overlapping.find(
    (item) =>
      item.track === null || input.track === null || item.track === input.track,
  );
  if (trackConflict) {
    const conflictingTitle = await activityTitle(trackConflict, context?.talks);
    throw new Error(
      `Este horário conflita com “${conflictingTitle}”, programada em ${intervalLabel(trackConflict)} como ${trackLabel(trackConflict.track)}.`,
    );
  }
  if (!talk) return;
  const overlappingTalks = await Promise.all(
    overlapping.flatMap((item) =>
      item.activity.type === "break"
        ? []
        : [
            cachedTalk(item.activity.talkId, context?.talks).then(
              (scheduledTalk) => ({
                item,
                talk: scheduledTalk,
              }),
            ),
          ],
    ),
  );
  const candidateSpeakers = new Set(talk.speakerIds);
  const speakerConflict = overlappingTalks
    .map(({ item, talk: scheduledTalk }) => ({
      item,
      talk: scheduledTalk,
      speakerId: scheduledTalk.speakerIds.find((speakerId) =>
        candidateSpeakers.has(speakerId),
      ),
    }))
    .find((conflict) => conflict.speakerId);
  if (speakerConflict) {
    const speaker = await getSpeakerById(speakerConflict.speakerId!).catch(
      () => null,
    );
    throw new Error(
      `${speaker ? `O palestrante “${speaker.name}”` : "Um palestrante selecionado"} já participa de “${speakerConflict.talk.title}” em ${intervalLabel(speakerConflict.item)}, como ${trackLabel(speakerConflict.item.track)}.`,
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

export async function updateScheduleVisibility(id: string, input: unknown) {
  const { active } = scheduleVisibilityInputSchema.parse(input);
  const current = await readSchedule(id);
  const item = scheduleFieldsSchema.parse({
    ...current,
    active,
    updatedAt: new Date(),
  });
  await db.collection(COLLECTION).doc(id).set(item);
  return item;
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
  const conflictContext: ConflictContext = {
    existing: await getExistingSchedule(),
    talks: new Map(),
  };
  talks.forEach((talk) => {
    if (talk) conflictContext.talks.set(talk.id, Promise.resolve(talk));
  });
  const speakerTracks = new Map<string, string>();
  for (const [index, talk] of talks.entries()) {
    if (!talk) continue;
    for (const speakerId of talk.speakerIds) {
      const previousTrack = speakerTracks.get(speakerId);
      if (previousTrack) {
        const speaker = await getSpeakerById(speakerId).catch(() => null);
        throw new Error(
          `${speaker ? `O palestrante “${speaker.name}”` : "Um palestrante"} foi selecionado nas trilhas ${previousTrack} e ${SCHEDULE_TRACKS[index].label} neste bloco. Escolha palestras com participantes diferentes.`,
        );
      }
      speakerTracks.set(speakerId, SCHEDULE_TRACKS[index].label);
    }
  }
  await Promise.all(
    entries.map((entry, index) =>
      validateConflict(entry, talks[index], conflictContext),
    ),
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
