import { toAdminProfile } from "@/back-features/profile-record";
import { Timestamp } from "firebase-admin/firestore";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { auth, db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import {
  participantRolesSchema,
  sponsorCompanyIdSchema,
  participantUpdateSchema,
  type Participant,
} from "@/contracts/participant";

const collection = getFirestoreCollectionName("profiles");
const adminUsersCollection = getFirestoreCollectionName("adminUsers");
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
    const now = Timestamp.now();
    const becomingAdmin = value.accessRoles[0] === "admin";
    const wasAdmin =
      Array.isArray(data.accessRoles) && data.accessRoles.includes("admin");
    if (becomingAdmin || wasAdmin) {
      const email =
        typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
      if (!email)
        throw new Error(
          "O participante precisa ter um e-mail para alterar o acesso administrativo.",
        );
      const user = await auth.getUserByEmail(email).catch((error: unknown) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "auth/user-not-found"
        ) {
          throw new Error(
            "Conta não encontrada no Firebase Authentication. Confira o cadastro antes de alterar o acesso administrativo.",
          );
        }
        throw error;
      });
      // Panel login uses the Firebase Auth UID, which can differ from the profile ID.
      const adminReference = db.collection(adminUsersCollection).doc(user.uid);
      const authorization = await transaction.get(adminReference);
      if (becomingAdmin) {
        transaction.set(
          adminReference,
          {
            email,
            isActive: true,
            updatedAt: now,
            ...(!authorization.exists ? { createdAt: now } : {}),
          },
          { merge: true },
        );
      } else if (authorization.exists) {
        transaction.update(adminReference, { isActive: false, updatedAt: now });
      }
    }
    transaction.update(reference, {
      accessRoles: value.accessRoles,
      sponsorCompanyId: value.sponsorCompanyId,
      updatedAt: now,
    });
    return parse(snapshot.id, {
      ...data,
      accessRoles: value.accessRoles,
      sponsorCompanyId: value.sponsorCompanyId,
    });
  });
}
