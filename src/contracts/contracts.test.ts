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
import { missionFieldsSchema, missionInputSchema } from "./mission";
import { raffleFieldsSchema, raffleInputSchema } from "./raffle";
import { rewardFieldsSchema } from "./reward";
import { speakerFieldsSchema } from "./speaker";
import { tagFieldsSchema, tagInputSchema } from "./tag";
import {
  SCHEDULE_TRACKS,
  getScheduleTrackOrder,
  scheduleBlockInputSchema,
  scheduleInputSchema,
  scheduleVisibilityInputSchema,
} from "./schedule";
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

describe("entradas administrativas", () => {
  it("não permite alterar campos operacionais de sorteio", () => {
    assert.equal(raffleInputSchema.safeParse(raffleFixture).success, true);
    const parsed = raffleInputSchema.parse(raffleFixture);
    assert.equal("winnerId" in parsed, false);
    assert.equal("status" in parsed, false);
  });

  it("aceita prêmios antigos e permite associar ou remover um patrocinador", () => {
    const { sponsorId: _sponsorId, ...legacy } = raffleFixture;
    assert.equal(raffleFieldsSchema.safeParse(legacy).success, true);
    for (const sponsorId of [null, "sponsor-1"]) {
      const input = raffleInputSchema.parse({ ...raffleFixture, sponsorId });
      assert.equal(input.sponsorId, sponsorId);
      assert.equal(
        raffleFieldsSchema.parse({ ...raffleFixture, sponsorId }).sponsorId,
        sponsorId,
      );
    }
    for (const sponsorId of ["", "   ", "a".repeat(129), 123]) {
      assert.equal(
        raffleInputSchema.safeParse({ ...raffleFixture, sponsorId }).success,
        false,
      );
    }
  });

  it("permite vários prêmios associados ao mesmo patrocinador", () => {
    const prizes = ["premio-1", "premio-2"].map((id) =>
      raffleInputSchema.parse({ ...raffleFixture, id, sponsorId: "sponsor-1" }),
    );
    assert.equal(prizes[0].sponsorId, prizes[1].sponsorId);
  });

  it("exige os campos públicos da tag", () => {
    const {
      eventId: _eventId,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...input
    } = tagFixture;
    assert.equal(tagInputSchema.safeParse(input).success, true);
    assert.equal(
      tagInputSchema.safeParse({ ...input, qrId: "inválido" }).success,
      false,
    );
  });

  it("valida horários e atividades da programação", () => {
    assert.equal(
      scheduleInputSchema.safeParse({
        id: "agenda-1",
        startTime: "09:00",
        endTime: "10:00",
        track: "MINAS",
        activity: { type: "talk", talkId: talkFixture.id },
        active: true,
      }).success,
      true,
    );
    assert.equal(
      scheduleInputSchema.safeParse({
        id: "agenda-1",
        startTime: "09:00",
        endTime: "09:00",
        track: "CURADO",
        activity: { type: "break", title: "Intervalo" },
        active: true,
      }).success,
      false,
    );
    assert.equal(
      scheduleInputSchema.safeParse({
        id: "agenda-minuto-invalido",
        startTime: "09:05",
        endTime: "10:00",
        track: "MINAS",
        activity: { type: "talk", talkId: talkFixture.id },
        active: true,
      }).success,
      false,
    );
  });

  it("mantém a ordem fixa das trilhas", () => {
    assert.deepEqual(
      SCHEDULE_TRACKS.map((track) => track.value),
      ["MINAS", "CURADO", "CANASTRA", "TRANCA", "COMUNIDADE"],
    );
    assert.equal(getScheduleTrackOrder("MINAS"), 0);
    assert.equal(getScheduleTrackOrder("COMUNIDADE"), 4);
  });

  it("valida um bloco completo com uma palestra por trilha", () => {
    const block = {
      startTime: "09:00",
      endTime: "10:00",
      talks: {
        MINAS: "talk-minas",
        CURADO: "talk-curado",
        CANASTRA: "talk-canastra",
        TRANCA: "talk-tranca",
        COMUNIDADE: "talk-comunidade",
      },
      active: true,
    };

    assert.equal(scheduleBlockInputSchema.safeParse(block).success, true);
    assert.equal(
      scheduleBlockInputSchema.safeParse({
        ...block,
        talks: { ...block.talks, COMUNIDADE: "talk-minas" },
      }).success,
      false,
    );
  });

  it("aceita apenas o estado de visibilidade na ação rápida", () => {
    assert.equal(
      scheduleVisibilityInputSchema.safeParse({ active: false }).success,
      true,
    );
    assert.equal(
      scheduleVisibilityInputSchema.safeParse({ active: true, track: "MINAS" })
        .success,
      false,
    );
  });

  it("separa palestras por trilha de atividades gerais", () => {
    const base = {
      id: "agenda-geral",
      startTime: "08:00",
      endTime: "09:00",
      active: true,
    };
    assert.equal(
      scheduleInputSchema.safeParse({
        ...base,
        track: null,
        activity: { type: "opening", title: "Abertura" },
      }).success,
      true,
    );
    assert.equal(
      scheduleInputSchema.safeParse({
        ...base,
        track: null,
        activity: { type: "talk", talkId: talkFixture.id },
      }).success,
      false,
    );
    assert.equal(
      scheduleInputSchema.safeParse({
        ...base,
        track: "MINAS",
        activity: { type: "break", title: "Coffee-break" },
      }).success,
      false,
    );
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

describe("missões por palavra-chave", () => {
  const keywordMission = {
    ...missionFixture,
    validationType: "keyword",
    qrId: null,
    keywordConfig: {
      acceptedAnswers: ["Conexão", "Networking"],
      maxAttempts: 3,
    },
  };
  it("aceita o contrato de criação e edição compatível com a Pokedex", () => {
    const parsed = missionFieldsSchema.parse(keywordMission);
    const { eventId, createdAt, updatedAt, ...input } = parsed;
    assert.deepEqual(
      missionInputSchema.parse(input).keywordConfig,
      keywordMission.keywordConfig,
    );
  });
  it("mantém cadastros antigos sem configuração de palavra-chave", () => {
    const { keywordConfig, ...legacy } = missionFixture;
    assert.equal(missionFieldsSchema.parse(legacy).keywordConfig, null);
  });
  it("exige respostas válidas e limite de tentativas", () => {
    for (const keywordConfig of [
      null,
      { acceptedAnswers: [], maxAttempts: 3 },
      { acceptedAnswers: [" "], maxAttempts: 3 },
      { acceptedAnswers: ["a".repeat(121)], maxAttempts: 3 },
      { acceptedAnswers: Array(21).fill("ok"), maxAttempts: 3 },
      { acceptedAnswers: ["ok"], maxAttempts: 0 },
      { acceptedAnswers: ["ok"], maxAttempts: 101 },
    ]) {
      assert.equal(
        missionFieldsSchema.safeParse({ ...keywordMission, keywordConfig })
          .success,
        false,
      );
    }
  });
  it("rejeita QR, progresso automático e configuração em outros tipos", () => {
    assert.equal(
      missionFieldsSchema.safeParse({
        ...keywordMission,
        qrId: missionFixture.qrId,
      }).success,
      false,
    );
    assert.equal(
      missionFieldsSchema.safeParse({
        ...keywordMission,
        progressRequirement: { type: "connections", target: 1 },
      }).success,
      false,
    );
    assert.equal(
      missionFieldsSchema.safeParse({
        ...keywordMission,
        validationType: "reviewer",
      }).success,
      false,
    );
  });
});

describe("missão de networking por interesse", () => {
  const mission = {
    ...missionFixture,
    qrId: null,
    validationType: "automatic",
    prerequisites: [],
    progressRequirement: { type: "shared-interests", target: 3 },
  };
  it("aceita a meta de pessoas com interesses em comum", () => {
    assert.equal(missionFieldsSchema.safeParse(mission).success, true);
    const { eventId, createdAt, updatedAt, ...input } =
      missionFieldsSchema.parse(mission);
    assert.deepEqual(missionInputSchema.parse(input).progressRequirement, {
      type: "shared-interests",
      target: 3,
    });
  });
  it("exige uma meta numérica positiva", () => {
    for (const target of [0, -1, "all", 1.5])
      assert.equal(
        missionFieldsSchema.safeParse({
          ...mission,
          progressRequirement: { type: "shared-interests", target },
        }).success,
        false,
      );
  });
});
