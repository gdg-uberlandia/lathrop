import { CURRENT_EVENT_ID } from "@/helpers/event";
import { admin, db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

function reference() {
  return db
    .collection(getFirestoreCollectionName("eventOperations"))
    .doc(CURRENT_EVENT_ID);
}
function parse(data: FirebaseFirestore.DocumentData | undefined) {
  if (data && data.eventId !== CURRENT_EVENT_ID)
    throw new Error("Invalid event operations identity");
  if (data?.eventClosed !== undefined && typeof data.eventClosed !== "boolean")
    throw new Error("Invalid closure status");
  return {
    eventClosed: data?.eventClosed === true,
    closedAt: data?.eventClosedAt?.toDate().toISOString() ?? null,
  };
}
export async function getEventStatus() {
  return parse((await reference().get()).data());
}
export async function closeEvent(operatorId: string) {
  if (!operatorId.trim()) throw new Error("Missing operator");
  const ref = reference();
  await db.runTransaction(async (transaction) => {
    const status = parse((await transaction.get(ref)).data());
    if (status.eventClosed) return;
    const now = admin.firestore.Timestamp.now();
    transaction.set(
      ref,
      {
        eventId: CURRENT_EVENT_ID,
        eventClosed: true,
        eventClosedAt: now,
        eventClosedBy: operatorId,
        updatedAt: now,
        updatedBy: operatorId,
      },
      { merge: true },
    );
  });
  const result = await getEventStatus();
  if (!result.eventClosed) throw new Error("Closure was not persisted");
  return result;
}
