import assert from "node:assert/strict";
import test from "node:test";
import admin from "firebase-admin";
import type {
  DocumentReference,
  Query,
  Transaction,
} from "firebase-admin/firestore";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { companyFixture, missionFixture } from "@/contracts/fixtures";
import { companyInputSchema } from "@/contracts/company";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

test("company ownership and deletion use consistent transactions", async (context) => {
  if (!admin.apps.length)
    admin.initializeApp({ projectId: "demo-company-integrity" });
  const { db } = await import("@/utils/db");
  const { createMission, updateMission } = await import("./missions");
  const { deleteCompany, updateCompany } = await import("./companies");
  const companies = getFirestoreCollectionName("companies");
  const missions = getFirestoreCollectionName("missions");
  const profiles = getFirestoreCollectionName("profiles");
  const companyPath = `${companies}/${companyFixture.id}`;
  const missionPath = `${missions}/${missionFixture.id}`;
  const documents = new Map<string, Record<string, unknown>>();
  const queries = [
    {
      query: db.collection(missions).where("eventId", "==", CURRENT_EVENT_ID),
      collection: missions,
      field: "eventId",
      value: CURRENT_EVENT_ID,
    },
    {
      query: db.collection(companies).where("eventId", "==", CURRENT_EVENT_ID),
      collection: companies,
      field: "eventId",
      value: CURRENT_EVENT_ID,
    },
    {
      query: db
        .collection(profiles)
        .where("sponsorCompanyId", "==", companyFixture.id),
      collection: profiles,
      field: "sponsorCompanyId",
      value: companyFixture.id,
    },
  ];
  const snapshot = (path: string) => ({
    id: path.slice(path.indexOf("/") + 1),
    exists: documents.has(path),
    data: () => documents.get(path),
  });
  const originalRunTransaction = db.runTransaction;
  db.runTransaction = async <T>(
    operation: (transaction: Transaction) => Promise<T>,
  ) => {
    const writes: Array<() => void> = [];
    const transaction = {
      get: async (reference: DocumentReference | Query) => {
        assert.equal(
          writes.length,
          0,
          "All reference checks must precede writes",
        );
        if ("path" in reference) return snapshot(reference.path);
        const query = queries.find((candidate) =>
          reference.isEqual(candidate.query),
        );
        assert.ok(query, "Unknown transactional query");
        return {
          docs: [...documents.entries()]
            .filter(
              ([path, data]) =>
                path.startsWith(`${query.collection}/`) &&
                data[query.field] === query.value,
            )
            .map(([path]) => snapshot(path)),
        };
      },
      set: (reference: DocumentReference, value: Record<string, unknown>) =>
        writes.push(() => documents.set(reference.path, value)),
      create: (reference: DocumentReference, value: Record<string, unknown>) =>
        writes.push(() => {
          assert.equal(documents.has(reference.path), false);
          documents.set(reference.path, value);
        }),
      delete: (reference: DocumentReference) =>
        writes.push(() => documents.delete(reference.path)),
    } as unknown as Transaction;
    const result = await operation(transaction);
    writes.forEach((write) => write());
    return result;
  };
  const {
    eventId: _event,
    createdAt: _created,
    updatedAt: _updated,
    ...baseInput
  } = missionFixture;
  const input = { ...baseInput, companyId: companyFixture.id };
  const {
    eventId: _companyEvent,
    createdAt: _companyCreated,
    updatedAt: _companyUpdated,
    ...companyInput
  } = companyFixture;
  try {
    await context.test(
      "refuses mission creation when its owner was deleted",
      async () => {
        documents.clear();
        await assert.rejects(createMission(input), /Empresa responsável/);
        assert.equal(documents.has(missionPath), false);
      },
    );
    await context.test(
      "checks owner existence again when editing a mission",
      async () => {
        documents.clear();
        documents.set(missionPath, { ...missionFixture });
        await assert.rejects(updateMission(input), /Empresa responsável/);
        assert.equal(documents.get(missionPath)?.companyId, null);
      },
    );
    await context.test(
      "preserves company ownership and creation time when saving a mission",
      async () => {
        documents.clear();
        documents.set(companyPath, { ...companyFixture });
        const created = await createMission(input);
        const updated = await updateMission({ ...input, active: false });
        assert.equal(updated.companyId, companyFixture.id);
        assert.deepEqual(updated.createdAt, created.createdAt);
        assert.equal(updated.active, false);
      },
    );
    await context.test(
      "prevents deletion while missions or employees reference the company",
      async () => {
        documents.clear();
        documents.set(companyPath, { ...companyFixture });
        documents.set(missionPath, {
          ...missionFixture,
          companyId: companyFixture.id,
        });
        await assert.rejects(
          deleteCompany(companyFixture.id),
          /vinculada a uma missão/,
        );
        documents.delete(missionPath);
        documents.set(`${profiles}/employee`, {
          eventId: CURRENT_EVENT_ID,
          sponsorCompanyId: companyFixture.id,
          accessRoles: ["sponsor"],
        });
        await assert.rejects(
          deleteCompany(companyFixture.id),
          /funcionários vinculados/,
        );
        assert.equal(documents.has(companyPath), true);
      },
    );
    await context.test(
      "deletes an unreferenced company and refuses to recreate it through an edit",
      async () => {
        documents.clear();
        documents.set(companyPath, { ...companyFixture });
        assert.equal(await deleteCompany(companyFixture.id), companyFixture.id);
        await assert.rejects(
          updateCompany(companyInputSchema.parse(companyInput)),
          /não encontrada/,
        );
        assert.equal(documents.has(companyPath), false);
      },
    );
    await context.test(
      "rejects references to companies from another event",
      async () => {
        documents.clear();
        documents.set(companyPath, { ...companyFixture, eventId: "other" });
        await assert.rejects(createMission(input), /Empresa responsável/);
        await assert.rejects(
          deleteCompany(companyFixture.id),
          /não encontrada/,
        );
      },
    );
  } finally {
    db.runTransaction = originalRunTransaction;
  }
});
