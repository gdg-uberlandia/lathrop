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
import { validateMissionDependencies } from "@/lib/missions/dependencies";

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

async function saveMission(
  input: MissionInput,
  editing: boolean,
): Promise<Mission> {
  const data = missionInputSchema.parse(input);
  const reference = db.collection(MISSIONS_COLLECTION).doc(data.id);
  return db.runTransaction(async (transaction) => {
    const [snapshot, missions, companies] = await Promise.all([
      transaction.get(reference),
      transaction.get(
        db
          .collection(MISSIONS_COLLECTION)
          .where("eventId", "==", CURRENT_EVENT_ID),
      ),
      transaction.get(
        db
          .collection(getFirestoreCollectionName("companies"))
          .where("eventId", "==", CURRENT_EVENT_ID),
      ),
    ]);
    if (
      editing &&
      (!snapshot.exists || snapshot.data()?.eventId !== CURRENT_EVENT_ID)
    )
      throw new Error(`Missão com id ${data.id} não encontrada.`);
    if (!editing && snapshot.exists)
      throw new Error(`Missão com id ${data.id} já existe.`);
    validateMissionDependencies(
      data,
      missions.docs.map((doc) => parseMission(doc.id, doc.data())),
      companies.docs.map((doc) => doc.id),
    );
    const now = new Date();
    const mission = missionFieldsSchema.parse({
      ...data,
      eventId: CURRENT_EVENT_ID,
      createdAt: editing
        ? parseMission(snapshot.id, snapshot.data()!).createdAt
        : now,
      updatedAt: now,
    });
    if (editing) transaction.set(reference, mission);
    else transaction.create(reference, mission);
    return mission;
  });
}

export async function createMission(input: MissionInput): Promise<Mission> {
  return saveMission(input, false);
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
  return saveMission(input, true);
}

export async function deleteMission(missionId: string): Promise<string> {
  await getMissionById(missionId);
  await db.collection(MISSIONS_COLLECTION).doc(missionId).delete();
  return missionId;
}
