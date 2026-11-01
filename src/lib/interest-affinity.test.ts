import assert from "node:assert/strict";
import { test } from "node:test";
import { selectDashboardContext } from "./dashboard-context";
import { buildInterestAffinity } from "./interest-affinity";
test("afinidade normaliza legado e não usa ausência de interesse como grupo contrário", () => {
  const d = buildInterestAffinity(
    selectDashboardContext({
      profiles: [
        { id: "a", interests: ["front-end"], skills: ["frontend"] },
        { id: "b", interests: ["cloud"] },
        { id: "missing" },
      ],
      activityCompletions: [
        {
          id: "v",
          participantId: "a",
          activityType: "company",
          activityId: "c",
          completedAt: "2026-10-31T12:00:00Z",
        },
      ],
      companies: [{ id: "c", name: "Empresa" }],
    }),
  );
  const group = d.interests.find((i) => i.id === "frontend")!;
  assert.equal(group.people, 1);
  assert.equal(group.comparisonPeople, 1);
  assert.equal(group.companies[0].difference, 100);
  assert.equal(d.missing, 1);
  assert.equal(group.companies[0].lift, null);
});
