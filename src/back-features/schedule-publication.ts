import {
  SchedulePublication,
  schedulePublicationInputSchema,
  schedulePublicationSchema,
} from "@/contracts/schedule-publication";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { Timestamp } from "firebase-admin/firestore";

const COLLECTION = getFirestoreCollectionName("schedule_publications");
const reference = () => db.collection(COLLECTION).doc(CURRENT_EVENT_ID);
const toDate = (value: unknown) =>
  value instanceof Timestamp ? value.toDate() : value;

export async function getSchedulePublication(): Promise<SchedulePublication> {
  const document = await reference().get();
  if (!document.exists)
    return schedulePublicationSchema.parse({
      eventId: CURRENT_EVENT_ID,
      published: false,
      publishedAt: null,
      updatedAt: null,
    });
  const data = document.data()!;
  return schedulePublicationSchema.parse({
    ...data,
    eventId: CURRENT_EVENT_ID,
    publishedAt: toDate(data.publishedAt),
    updatedAt: toDate(data.updatedAt),
  });
}

export async function updateSchedulePublication(input: unknown) {
  const { published } = schedulePublicationInputSchema.parse(input);
  const current = await getSchedulePublication();
  const now = new Date();
  const publication = schedulePublicationSchema.parse({
    eventId: CURRENT_EVENT_ID,
    published,
    publishedAt: published ? now : current.publishedAt,
    updatedAt: now,
  });
  await reference().set(publication);
  return publication;
}
