import assert from "node:assert/strict";
import { test } from "node:test";
import admin from "firebase-admin";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
test("dashboard fixa a base em participantes e não retorna qualidade dos dados", async () => {
  if (!admin.apps.length)
    admin.initializeApp({ projectId: "demo-dashboard-tests" });
  const { db } = await import("@/utils/db");
  const { getPokedexDashboard } = await import("./pokedex-dashboard");
  const original = db.collection;
  const data: Record<string, { id: string; [key: string]: unknown }[]> = {
    [getFirestoreCollectionName("profiles")]: [
      { id: "participant", accessRoles: ["participant"], ticketBalance: 0 },
      { id: "admin", accessRoles: ["admin"], ticketBalance: 0 },
      { id: "reviewer", accessRoles: ["reviewer"], ticketBalance: 0 },
    ],
    [getFirestoreCollectionName("activityCompletions")]: [
      "participant",
      "admin",
      "reviewer",
    ].map((id) => ({
      id,
      participantId: id,
      activityType: "mission",
      activityId: "m",
      completedAt: "2026-10-31T12:00:00Z",
    })),
    [getFirestoreCollectionName("missions")]: [{ id: "m", title: "Missão" }],
  };
  db.collection = ((name: string) => {
    const query = {
      where(field: string, _op: string, event: string) {
        assert.equal(field, "eventId");
        assert.equal(event, CURRENT_EVENT_ID);
        return this;
      },
      select() {
        return this;
      },
      async get() {
        return {
          docs: (data[name] ?? []).map(({ id, ...value }) => ({
            id,
            data: () => value,
          })),
        };
      },
    };
    return query as unknown as ReturnType<typeof db.collection>;
  }) as typeof db.collection;
  try {
    const result = await getPokedexDashboard();
    assert.equal(result.filters.role, "participant");
    assert.equal(result.base.profiles, 1);
    assert.equal(result.metrics.activities, 1);
    assert.equal("quality" in result, false);
    assert.equal(
      result.network.graph.nodes.some((n) => n.id === "admin"),
      false,
    );
  } finally {
    db.collection = original;
  }
});
