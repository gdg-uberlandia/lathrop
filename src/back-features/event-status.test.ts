import assert from "node:assert/strict";
import { test } from "node:test";
import admin from "firebase-admin";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

test("encerramento idempotente preserva operações e relê o registro no mesmo evento", async () => {
  if (!admin.apps.length)
    admin.initializeApp({ projectId: "demo-event-status" });
  const { db } = await import("@/utils/db");
  const { closeEvent, getEventStatus } = await import("./event-status");
  const originalCollection = db.collection;
  const originalTransaction = db.runTransaction;
  let data: Record<string, unknown> | undefined;
  let writes = 0;
  const snapshot = () => ({ data: () => data });
  const ref = { get: async () => snapshot() };
  db.collection = ((name: string) => {
    assert.equal(name, getFirestoreCollectionName("eventOperations"));
    return {
      doc: (id: string) => {
        assert.equal(id, CURRENT_EVENT_ID);
        return ref;
      },
    };
  }) as typeof db.collection;
  db.runTransaction = (async (operation: (tx: unknown) => Promise<unknown>) =>
    operation({
      get: async (readRef: unknown) => {
        assert.equal(readRef, ref);
        return snapshot();
      },
      set: (
        writeRef: unknown,
        value: Record<string, unknown>,
        options: { merge: boolean },
      ) => {
        assert.equal(writeRef, ref);
        assert.equal(options.merge, true);
        data = { ...data, ...value };
        writes++;
      },
    })) as typeof db.runTransaction;
  try {
    assert.deepEqual(await getEventStatus(), {
      eventClosed: false,
      closedAt: null,
    });
    data = {
      eventId: CURRENT_EVENT_ID,
      ticketConversionEnabled: false,
      rewardRedemptionEnabled: true,
      raffleClosureStatus: "closed",
    };
    const closed = await closeEvent("admin");
    assert.equal(closed.eventClosed, true);
    assert.ok(closed.closedAt);
    assert.equal(data.ticketConversionEnabled, false);
    assert.equal(data.rewardRedemptionEnabled, true);
    assert.equal(data.raffleClosureStatus, "closed");
    assert.equal(data.eventClosedBy, "admin");
    assert.deepEqual(await closeEvent("other-admin"), closed);
    assert.equal(writes, 1);
    assert.equal(data.eventClosedBy, "admin");
    data = { eventId: "another-event" };
    await assert.rejects(closeEvent("admin"), /identity/);
    assert.equal(writes, 1);
  } finally {
    db.collection = originalCollection;
    db.runTransaction = originalTransaction;
  }
});
