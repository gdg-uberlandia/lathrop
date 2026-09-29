import type { Firestore } from "firebase-admin/firestore";

export interface PublicationOptions {
  eventId: string;
  collectionPrefix?: "" | "test_";
  now?: Date;
}

function isDue(value: unknown, now: Date): value is string {
  if (typeof value !== "string") return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && time <= now.getTime();
}

export async function publishDueSpeakers(
  db: Firestore,
  { eventId, collectionPrefix = "", now = new Date() }: PublicationOptions,
) {
  const publications = db.collection(`${collectionPrefix}speakerPublications`);
  const speakers = db.collection(`${collectionPrefix}speakers`);
  // Pending schedules only. One equality query avoids a composite index.
  const pending = await publications.where("eventId", "==", eventId).get();
  let published = 0;
  for (const candidate of pending.docs) {
    if (!isDue(candidate.data().publishAt, now)) continue;
    const didPublish = await db.runTransaction(async (transaction) => {
      // Reread the schedule: it may have been cancelled or rescheduled since the query.
      const schedule = await transaction.get(candidate.ref);
      const data = schedule.data();
      if (
        !data ||
        data.eventId !== eventId ||
        data.speakerId !== candidate.id ||
        !isDue(data.publishAt, now)
      )
        return false;
      const speakerRef = speakers.doc(candidate.id);
      const speaker = await transaction.get(speakerRef);
      if (
        !speaker.exists ||
        speaker.data()?.eventId !== eventId ||
        speaker.data()?.isVisible === true
      ) {
        transaction.delete(candidate.ref);
        return false;
      }
      transaction.update(speakerRef, { isVisible: true, updatedAt: now });
      transaction.delete(candidate.ref);
      return true;
    });
    if (didPublish) published += 1;
  }
  return { published };
}
