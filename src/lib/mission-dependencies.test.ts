import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { MissionInput } from "@/models/mission";
import { validateMissionDependencies } from "./missions/dependencies";

const mission = (id: string, dependencies: string[] = []): MissionInput => ({
  id,
  title: `Missão ${id}`,
  description: "Descrição válida",
  imageUrl: null,
  validationType: "reviewer",
  qrId: null,
  progressRequirement: null,
  prerequisites: dependencies.map((activityId) => ({
    type: "mission",
    activityId,
  })),
  active: true,
  order: 0,
  xpAwarded: null,
});

describe("dependências entre missões", () => {
  it("aceita uma cadeia sem ciclos", () => {
    assert.doesNotThrow(() =>
      validateMissionDependencies(mission("c", ["b"]), [
        mission("a"),
        mission("b", ["a"]),
      ]),
    );
  });
  it("rejeita dependência circular transitiva", () => {
    assert.throws(
      () =>
        validateMissionDependencies(mission("a", ["c"]), [
          mission("a"),
          mission("b", ["a"]),
          mission("c", ["b"]),
        ]),
      /ciclo/,
    );
  });
  it("rejeita referência para missão inexistente", () => {
    assert.throws(
      () => validateMissionDependencies(mission("a", ["missing"]), []),
      /não encontrada/,
    );
  });
  it("rejeita referência para company inexistente", () => {
    const candidate = {
      ...mission("a"),
      prerequisites: [{ type: "company" as const, activityId: "missing" }],
    };
    assert.throws(
      () => validateMissionDependencies(candidate, [], []),
      /Company.*não encontrada/,
    );
  });
});
