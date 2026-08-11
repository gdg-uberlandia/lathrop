import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { companyFieldsSchema } from "./company";
import {
  companyFixture,
  missionFixture,
  raffleFixture,
  rewardFixture,
  speakerFixture,
  tagFixture,
  talkFixture,
} from "./fixtures";
import { missionFieldsSchema } from "./mission";
import { raffleFieldsSchema } from "./raffle";
import { rewardFieldsSchema } from "./reward";
import { speakerFieldsSchema } from "./speaker";
import { tagFieldsSchema } from "./tag";
import { talkFieldsSchema } from "./talk";

describe("contratos compartilhados", () => {
  const fixtures = [
    ["company", companyFieldsSchema, companyFixture],
    ["mission", missionFieldsSchema, missionFixture],
    ["raffle", raffleFieldsSchema, raffleFixture],
    ["reward", rewardFieldsSchema, rewardFixture],
    ["speaker", speakerFieldsSchema, speakerFixture],
    ["tag", tagFieldsSchema, tagFixture],
    ["talk", talkFieldsSchema, talkFixture],
  ] as const;

  for (const [entity, schema, fixture] of fixtures) {
    it(`aceita a fixture de ${entity}`, () => {
      assert.equal(schema.safeParse(fixture).success, true);
    });
  }

  it("rejeita campos desconhecidos em documentos estritos", () => {
    const result = speakerFieldsSchema.safeParse({
      ...speakerFixture,
      legacyField: true,
    });

    assert.equal(result.success, false);
  });
});

describe("regras relacionais de missões", () => {
  it("exige qrId para missão QR", () => {
    assert.equal(
      missionFieldsSchema.safeParse({ ...missionFixture, qrId: null }).success,
      false,
    );
  });

  it("exige progresso e proíbe pré-requisitos em missão automática", () => {
    const automaticMission = {
      ...missionFixture,
      validationType: "automatic",
      qrId: null,
      progressRequirement: { type: "connections", target: 5 },
      prerequisites: [],
    };

    assert.equal(missionFieldsSchema.safeParse(automaticMission).success, true);
    assert.equal(
      missionFieldsSchema.safeParse({
        ...automaticMission,
        prerequisites: [{ type: "mission", activityId: "outra-missao" }],
      }).success,
      false,
    );
  });
});

describe("regras relacionais de palestras", () => {
  it("exige ao menos um palestrante", () => {
    assert.equal(
      talkFieldsSchema.safeParse({ ...talkFixture, speakerIds: [] }).success,
      false,
    );
  });

  it("rejeita palestrantes duplicados", () => {
    assert.equal(
      talkFieldsSchema.safeParse({
        ...talkFixture,
        speakerIds: [speakerFixture.id, speakerFixture.id],
      }).success,
      false,
    );
  });
});
