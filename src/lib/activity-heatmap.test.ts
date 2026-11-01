import assert from "node:assert/strict";
import { test } from "node:test";
import { buildActivityHeatmap } from "./activity-heatmap";
test("mapa inclui horas vazias e deduplica pessoas por célula e dia", () => {
  const [day] = buildActivityHeatmap([
    { hour: "2026-10-31T09", kind: "mission", people: ["a"] },
    { hour: "2026-10-31T09", kind: "mission", people: ["a"] },
    { hour: "2026-10-31T10", kind: "connection", people: ["a", "b"] },
  ]);
  assert.equal(day.cells.length, 144);
  assert.equal(day.actions, 3);
  assert.equal(day.people, 2);
  assert.equal(
    day.cells.find((c) => c.kind === "mission" && c.hour === 9)?.actions,
    2,
  );
  assert.equal(
    day.cells.find((c) => c.kind === "mission" && c.hour === 9)?.people,
    1,
  );
  assert.equal(
    day.cells.find((c) => c.kind === "mission" && c.hour === 0)?.actions,
    0,
  );
});
test("mapa separa os dias e aceita período vazio", () => {
  assert.deepEqual(buildActivityHeatmap([]), []);
  assert.equal(
    buildActivityHeatmap([
      { hour: "2026-10-31T23", kind: "tag", people: ["a"] },
      { hour: "2026-11-01T00", kind: "tag", people: ["a"] },
    ]).length,
    2,
  );
});
