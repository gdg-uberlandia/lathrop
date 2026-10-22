import { toAdminProfile } from "@/back-features/profile-record";
import { Timestamp } from "firebase-admin/firestore";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import {
  participantRolesSchema,
  sponsorCompanyIdSchema,
  participantUpdateSchema,
  type Participant,
} from "@/contracts/participant";

const collection = getFirestoreCollectionName("profiles");
function parse(id: string, data: FirebaseFirestore.DocumentData): Participant {
  return {
    id,
    name: typeof data.displayName === "string" ? data.displayName : "Sem nome",
    avatarUrl: toAdminProfile(id, data)?.photoURL?.trim() || null,
    email: typeof data.email === "string" ? data.email : "",
    sponsorCompanyId: sponsorCompanyIdSchema.parse(data.sponsorCompanyId),
    accessRoles: participantRolesSchema.parse(
      data.accessRoles ?? ["participant"],
    ),
  };
}
export async function listParticipants(): Promise<Participant[]> {
  const snapshot = await db
    .collection(collection)
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .map((doc) => parse(doc.id, doc.data()))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}
export async function updateParticipantRoles(
  input: unknown,
): Promise<Participant> {
  const value = participantUpdateSchema.parse(input);
  const reference = db.collection(collection).doc(value.id);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const data = snapshot.data();
    if (!data || data.eventId !== CURRENT_EVENT_ID)
      throw new Error("Participante não encontrado neste evento");
    if (value.sponsorCompanyId) {
      const company = await transaction.get(
        db
          .collection(getFirestoreCollectionName("companies"))
          .doc(value.sponsorCompanyId),
      );
      if (
        !company.exists ||
        company.data()?.eventId !== CURRENT_EVENT_ID ||
        company.data()?.active !== true
      )
        throw new Error("Selecione uma empresa ativa deste evento");
    }
    transaction.update(reference, {
      accessRoles: value.accessRoles,
      sponsorCompanyId: value.sponsorCompanyId,
      updatedAt: Timestamp.now(),
    });
    return parse(snapshot.id, {
      ...data,
      accessRoles: value.accessRoles,
      sponsorCompanyId: value.sponsorCompanyId,
    });
  });
}
