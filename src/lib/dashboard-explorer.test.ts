import assert from "node:assert/strict";
import { test } from "node:test";
import { exploreDashboardParticipants } from "./dashboard-explorer";
import type { DashboardSource } from "./pokedex-dashboard";
const source: DashboardSource = {
  profiles: [
    {
      id: "a",
      displayName: "Ana",
      email: "a@example.com",
      accessRoles: ["participant"],
    },
    { id: "b", displayName: "Bia", accessRoles: ["admin"] },
  ],
  activityCompletions: [
    {
      id: "early",
      participantId: "b",
      activityType: "company",
      activityId: "c",
      completedAt: "2026-10-31T07:59:00-03:00",
    },
    {
      id: "valid",
      participantId: "a",
      activityType: "company",
      activityId: "c",
      completedAt: "2026-10-31T08:00:00-03:00",
    },
  ],
  connections: [
    {
      id: "connection",
      participantIds: ["a", "b"],
      status: "accepted",
      acceptedAt: "2026-10-31T08:00:00-03:00",
    },
  ],
};
test("exploração mantém filtros de papel e horário e permite buscar identidade", () => {
  assert.equal(
    exploreDashboardParticipants(
      source,
      { role: "participant" },
      "hour",
      "2026-10-31T08|company",
    ).total,
    1,
  );
  assert.equal(
    exploreDashboardParticipants(source, {}, "hour", "2026-10-31T07").total,
    0,
  );
  assert.equal(
    exploreDashboardParticipants(source, {}, "company", "c", "ANA").items[0].id,
    "a",
  );
  assert.equal(
    exploreDashboardParticipants(source, { role: "admin" }, "company", "c")
      .total,
    0,
  );
});
test("faixas e inativos incluem perfis sem ações e paginação é limitada", () => {
  assert.equal(
    exploreDashboardParticipants(source, {}, "band", "1-5").total,
    2,
  );
  assert.equal(
    exploreDashboardParticipants(source, {}, "band", "51+").total,
    0,
  );
  assert.equal(
    exploreDashboardParticipants(source, {}, "all", "", "", 999).page,
    1,
  );
});
