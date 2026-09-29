import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defineString } from "firebase-functions/params";
import { info } from "firebase-functions/logger";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { publishDueSpeakers } from "./publish-speakers";

initializeApp();
const eventId = defineString("SPEAKER_PUBLICATION_EVENT_ID", {
  default: "devfest-triangulo-2026",
});
const prefix = defineString("SPEAKER_PUBLICATION_COLLECTION_PREFIX", {
  default: "",
});

export const publishScheduledSpeakers = onSchedule(
  {
    schedule: "0,30 * * * *",
    timeZone: "America/Sao_Paulo",
    region: "us-east1",
    timeoutSeconds: 300,
    maxInstances: 1,
    retryCount: 3,
    minBackoffSeconds: 60,
    maxBackoffSeconds: 300,
  },
  async () => {
    const collectionPrefix = prefix.value();
    if (collectionPrefix !== "" && collectionPrefix !== "test_") {
      throw new Error("Invalid speaker publication collection prefix");
    }
    const result = await publishDueSpeakers(getFirestore(), {
      eventId: eventId.value(),
      collectionPrefix,
    });
    info("Speaker publication completed", {
      ...result,
      eventId: eventId.value(),
      collectionPrefix,
    });
  },
);
