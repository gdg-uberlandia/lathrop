import assert from "node:assert/strict";
import test from "node:test";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import type { Transaction, DocumentReference } from "firebase-admin/firestore";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { rewardFixture } from "@/contracts/fixtures";
import { rewardInputSchema, rewardUpdateSchema } from "@/contracts/reward";

const {
  id: _id,
  eventId: _eventId,
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...fields
} = rewardFixture;
const input = { id: "reward-test", ...fields };

test("reward input matches the Pokédex limits and rejects operational fields", () => {
  assert.equal(rewardInputSchema.safeParse(input).success, true);
  assert.equal(
    rewardInputSchema.safeParse({ ...input, stock: 0, redemptionLimit: null })
      .success,
    true,
  );
  for (const invalid of [
    { ticketCost: 0 },
    { ticketCost: 1001 },
    { stock: -1 },
    { stock: 1.5 },
    { redemptionLimit: 0 },
    { redemptionLimit: 101 },
    { name: "" },
    { description: "" },
    { imageUrl: "not a URL" },
    { eventId: "other" },
    { id: "../other" },
    { id: ".." },
    { createdAt: new Date() },
  ])
    assert.equal(
      rewardInputSchema.safeParse({ ...input, ...invalid }).success,
      false,
    );
  assert.equal(rewardUpdateSchema.safeParse(input).success, false);
});

test("reward updates preserve redemption history and cannot overwrite concurrent redemptions or other events", async () => {
  if (!admin.apps.length)
    admin.initializeApp({ projectId: "demo-rewards-tests" });
  const { db } = await import("@/utils/db");
  const { updateReward } = await import("./rewards");
  const now = Timestamp.fromDate(new Date("2026-10-25T12:00:00Z"));
  const path = `${getFirestoreCollectionName("rewards")}/${input.id}`;
  const documents = new Map<string, Record<string, unknown>>([
    [
      path,
      {
        ...fields,
        eventId: CURRENT_EVENT_ID,
        createdAt: now,
        updatedAt: now,
        auditMarker: "preserve",
      },
    ],
  ]);
  let writes = 0;
  const transaction = {
    get: async (reference: DocumentReference) => ({
      id: reference.id,
      exists: documents.has(reference.path),
      data: () => documents.get(reference.path),
    }),
    update: (reference: DocumentReference, value: Record<string, unknown>) => {
      writes++;
      documents.set(reference.path, {
        ...documents.get(reference.path),
        ...value,
      });
    },
  } as unknown as Transaction;
  const original = db.runTransaction;
  db.runTransaction = async <T>(
    operation: (transaction: Transaction) => Promise<T>,
  ) => operation(transaction);
  try {
    const update = {
      ...input,
      stock: 42,
      ticketCost: 20,
      expectedUpdatedAt: now.toDate().toISOString(),
    };
    const saved = await updateReward(update);
    assert.equal(saved.stock, 42);
    assert.equal(saved.ticketCost, 20);
    assert.equal(documents.get(path)?.createdAt, now);
    assert.equal(documents.get(path)?.auditMarker, "preserve");
    assert.ok(documents.get(path)?.updatedAt instanceof Timestamp);
    assert.equal(writes, 1);
    await assert.rejects(updateReward(update), /resgatado/);
    assert.equal(writes, 1);
    assert.equal(documents.get(path)?.stock, 42);
    documents.set(path, { ...documents.get(path), eventId: "other" });
    await assert.rejects(updateReward(update), /neste evento/);
    documents.delete(path);
    await assert.rejects(updateReward(update), /neste evento/);
    assert.equal(writes, 1);
  } finally {
    db.runTransaction = original;
  }
});
