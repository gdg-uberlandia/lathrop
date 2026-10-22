import assert from "node:assert/strict";
import test from "node:test";
import admin from "firebase-admin";
import type { Transaction, DocumentReference } from "firebase-admin/firestore";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

test("sponsor assignment validates the company in the same transaction as the role update", async () => {
  if (!admin.apps.length)
    admin.initializeApp({ projectId: "demo-sponsor-tests" });
  const { db } = await import("@/utils/db");
  const { updateParticipantRoles } = await import("./participants");
  const documents = new Map<string, Record<string, unknown>>();
  const profilePath = `${getFirestoreCollectionName("profiles")}/employee`;
  const companyPath = `${getFirestoreCollectionName("companies")}/company-a`;
  documents.set(profilePath, {
    eventId: CURRENT_EVENT_ID,
    displayName: "Funcionário",
    email: "employee@example.com",
    accessRoles: ["participant"],
  });
  const transaction = {
    get: async (reference: DocumentReference) => ({
      id: reference.id,
      exists: documents.has(reference.path),
      data: () => documents.get(reference.path),
    }),
    update: (reference: DocumentReference, value: Record<string, unknown>) =>
      documents.set(reference.path, {
        ...documents.get(reference.path),
        ...value,
      }),
  } as unknown as Transaction;
  const originalRunTransaction = db.runTransaction;
  db.runTransaction = async <T>(
    operation: (transaction: Transaction) => Promise<T>,
  ) => operation(transaction);
  try {
    const input = {
      id: "employee",
      accessRoles: ["sponsor"],
      sponsorCompanyId: "company-a",
    };
    for (const company of [
      null,
      { eventId: "other", active: true },
      { eventId: CURRENT_EVENT_ID, active: false },
    ]) {
      documents.delete(companyPath);
      if (company) documents.set(companyPath, company);
      await assert.rejects(updateParticipantRoles(input), /empresa ativa/);
      assert.deepEqual(documents.get(profilePath)?.accessRoles, [
        "participant",
      ]);
    }
    documents.set(companyPath, { eventId: CURRENT_EVENT_ID, active: true });
    const employee = await updateParticipantRoles(input);
    assert.deepEqual(employee.accessRoles, ["sponsor"]);
    assert.equal(employee.sponsorCompanyId, "company-a");
    const reviewer = await updateParticipantRoles({
      id: "employee",
      accessRoles: ["reviewer"],
    });
    assert.equal(reviewer.sponsorCompanyId, null);
    assert.equal(documents.get(profilePath)?.sponsorCompanyId, null);
    documents.set(profilePath, {
      eventId: "other",
      accessRoles: ["participant"],
    });
    await assert.rejects(updateParticipantRoles(input), /neste evento/);
  } finally {
    db.runTransaction = originalRunTransaction;
  }
});
