import { isPushEnabled } from "@/back-features/push-config";
import { deliverNotice } from "@/back-features/notice-delivery";
import { Timestamp } from "firebase-admin/firestore";
import webpush from "web-push";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import {
  noticeInputSchema,
  noticeSchema,
  pushSubscriptionSchema,
  type Notice,
} from "@/contracts/notice";

const notices = () => db.collection(getFirestoreCollectionName("notices"));
const subscriptions = () =>
  db.collection(getFirestoreCollectionName("pushSubscriptions"));
export type PublishedNotice = Notice & {
  pushStatus: "disabled" | "sending" | "completed" | "partial";
  sent: number;
  failed: number;
  skipped: number;
};
export function isPushConfigured() {
  return Boolean(
    isPushEnabled() &&
      process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT,
  );
}
function parse(
  id: string,
  data: FirebaseFirestore.DocumentData,
): PublishedNotice {
  return {
    ...noticeSchema.parse({
      ...data,
      id,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
    }),
    pushStatus: data.pushStatus,
    sent: data.sent ?? 0,
    failed: data.failed ?? 0,
    skipped: data.skipped ?? 0,
  };
}
export async function getNotices(): Promise<PublishedNotice[]> {
  if (!isPushEnabled()) throw new Error("Recurso indisponível");
  const snapshot = await notices()
    .where("eventId", "==", CURRENT_EVENT_ID)
    .get();
  return snapshot.docs
    .map((doc) => parse(doc.id, doc.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function publishNotice(
  input: unknown,
  adminId: string,
): Promise<PublishedNotice> {
  if (!isPushEnabled()) throw new Error("Recurso indisponível");
  const value = noticeInputSchema.parse(input);
  if (value.sendPush && !isPushConfigured())
    throw new Error(
      "Configure as chaves VAPID antes de enviar push, ou publique sem push.",
    );
  const reference = notices().doc(value.id);
  const created = await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(reference);
    if (existing.exists) {
      const data = existing.data()!;
      if (
        data.eventId !== CURRENT_EVENT_ID ||
        data.createdBy !== adminId ||
        data.title !== value.title ||
        data.body !== value.body ||
        data.link !== value.link ||
        data.sendPush !== value.sendPush
      )
        throw new Error(
          "Esta publicação já existe com outros dados. Atualize a página.",
        );
      return false;
    }
    transaction.create(reference, {
      ...value,
      eventId: CURRENT_EVENT_ID,
      createdBy: adminId,
      createdAt: Timestamp.now(),
      pushStatus: value.sendPush ? "sending" : "disabled",
      sent: 0,
      failed: 0,
      skipped: 0,
    });
    return true;
  });
  // Repeating the same publication never starts another broadcast.
  if (!created || !value.sendPush)
    return parse(value.id, (await reference.get()).data()!);
  let sent = 0;
  let failed = 0;
  let skipped = 0;
  try {
    const [devices, profiles] = await Promise.all([
      subscriptions().where("eventId", "==", CURRENT_EVENT_ID).get(),
      db
        .collection(getFirestoreCollectionName("profiles"))
        .where("eventId", "==", CURRENT_EVENT_ID)
        .get(),
    ]);
    const participants = new Set(
      profiles.docs
        .filter((doc) =>
          (doc.data().accessRoles ?? ["participant"]).includes("participant"),
        )
        .map((doc) => doc.id),
    );
    const recipients = devices.docs.filter((doc) =>
      participants.has(doc.data().userId),
    );
    const totals = await deliverNotice(
      recipients,
      async (device) => {
        try {
          const subscription = pushSubscriptionSchema.parse({
            endpoint: device.data().endpoint,
            keys: device.data().keys,
          });
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              noticeId: value.id,
              title: value.title,
              body: value.body.slice(0, 160),
            }),
            {
              vapidDetails: {
                subject: process.env.VAPID_SUBJECT!,
                publicKey: process.env.VAPID_PUBLIC_KEY!,
                privateKey: process.env.VAPID_PRIVATE_KEY!,
              },
              TTL: 60 * 60,
              timeout: 5000,
            },
          );
        } catch (error) {
          if (
            error &&
            typeof error === "object" &&
            "statusCode" in error &&
            (error.statusCode === 404 || error.statusCode === 410)
          ) {
            await device.ref
              .delete({ lastUpdateTime: device.updateTime })
              .catch(() => undefined);
          }
          throw error;
        }
      },
      async (totals) => {
        sent = totals.sent;
        failed = totals.failed;
        skipped = totals.skipped;
        await reference.update(totals);
      },
    );
    sent = totals.sent;
    failed = totals.failed;
    skipped = totals.skipped;
    await reference.update({
      sent,
      failed,
      skipped,
      pushStatus: failed || skipped ? "partial" : "completed",
      pushFinishedAt: Timestamp.now(),
    });
  } catch {
    // The publication remains accessible even if the push service fails.
    await reference.update({
      sent,
      failed,
      skipped,
      pushStatus: "partial",
      pushFinishedAt: Timestamp.now(),
    });
  }
  return parse(value.id, (await reference.get()).data()!);
}
