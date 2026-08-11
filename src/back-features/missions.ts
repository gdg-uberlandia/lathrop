import { Timestamp } from "firebase-admin/firestore";

import { CURRENT_EVENT_ID } from "@/helpers/event";
import {
  Mission,
  MissionInput,
  missionFieldsSchema,
  missionInputSchema,
} from "@/models/mission";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const MISSIONS_COLLECTION = getFirestoreCollectionName("missions");

function parseMission(id: string, value: FirebaseFirestore.DocumentData) {
  return missionFieldsSchema.parse({
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
}

export async function getAllMissions(): Promise<Mission[]> {
  const snapshot = await db
    .collection(MISSIONS_COLLECTION)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();

  return snapshot.docs
    .map((document) => parseMission(document.id, document.data()))
    .sort(
      (first, second) =>
        first.order - second.order ||
        first.title.localeCompare(second.title, "pt-BR"),
    );
}

export async function createMission(input: MissionInput): Promise<Mission> {
  const data = missionInputSchema.parse(input);
  const reference = db.collection(MISSIONS_COLLECTION).doc(data.id);

  if ((await reference.get()).exists) {
    throw new Error(`Missão com id ${data.id} já existe.`);
  }

  const now = new Date();
  const mission = missionFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: now,
    updatedAt: now,
  });
  await reference.create(mission);
  return mission;
}

export async function getMissionById(missionId: string): Promise<Mission> {
  const document = await db
    .collection(MISSIONS_COLLECTION)
    .doc(missionId)
    .get();

  if (!document.exists) {
    throw new Error(`Missão com id ${missionId} não encontrada.`);
  }

  const mission = parseMission(document.id, document.data()!);
  if (mission.eventId !== CURRENT_EVENT_ID) {
    throw new Error(`Missão com id ${missionId} não encontrada.`);
  }
  return mission;
}

export async function updateMission(input: MissionInput): Promise<Mission> {
  const data = missionInputSchema.parse(input);
  const current = await getMissionById(data.id);
  const mission = missionFieldsSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    createdAt: current.createdAt,
    updatedAt: new Date(),
  });

  await db.collection(MISSIONS_COLLECTION).doc(data.id).set(mission);
  return mission;
}

export async function deleteMission(missionId: string): Promise<string> {
  await getMissionById(missionId);
  await db.collection(MISSIONS_COLLECTION).doc(missionId).delete();
  return missionId;
}
