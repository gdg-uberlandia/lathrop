import assert from "node:assert/strict";
import { test } from "node:test";
import { buildEngagementDistribution } from "./engagement-distribution";
test("distribuição inclui perfis sem ações e não conta pessoas externas", () => {
  const d = buildEngagementDistribution(
    ["a", "b", "c"],
    [
      {
        hour: "2026-10-31T09",
        kind: "connection",
        people: ["a", "a", "other"],
      },
      { hour: "2026-10-31T10", kind: "mission", people: ["b"] },
    ],
  );
  assert.equal(d.active, 2);
  assert.equal(d.totalParticipations, 2);
  assert.equal(d.median, 1);
  assert.equal(d.p90, 1);
  assert.equal(
    d.bands.reduce((s, b) => s + b.people, 0),
    3,
  );
  assert.equal(d.bands[0].people, 1);
  assert.deepEqual(d.concentration[d.concentration.length - 1], {
    people: 100,
    actions: 100,
  });
});
test("concentração e mediana refletem uma pessoa com muitas ações", () => {
  const events = Array.from({ length: 9 }, () => ({
    hour: "2026-10-31T09",
    kind: "mission" as const,
    people: ["a"],
  }));
  events.push({ hour: "2026-10-31T09", kind: "mission", people: ["b"] });
  const d = buildEngagementDistribution(["a", "b"], events);
  assert.equal(d.median, 5);
  assert.equal(d.p90, 9);
  assert.equal(d.topShare, 90);
  assert.equal(d.topCount, 1);
});
test("base sem ações não produz divisão por zero", () => {
  const d = buildEngagementDistribution(["a"], []);
  assert.equal(d.topShare, 0);
  assert.equal(d.topCount, 0);
  assert.equal(d.bands[0].percent, 100);
  assert.equal(buildEngagementDistribution([], []).median, 0);
});
