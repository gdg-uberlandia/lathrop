import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  publicationInputToIso,
  publicationInputValue,
  validatePublicationTime,
} from "./speaker-publication-time";
import { adminSpeakerInputSchema } from "../contracts/speaker-publication";
import { speakerCreateSchema } from "../contracts/speaker";
import { speakerFixture } from "../contracts/fixtures";
import { speakerFormSchema } from "../components/admin/speakers/speakers-schema";

const now = new Date("2026-09-29T12:00:00.000Z");
const {
  eventId: _eventId,
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...speakerInput
} = speakerFixture;
const base = { ...speakerCreateSchema.parse(speakerInput), isVisible: false };

describe("horários de publicação em Brasília", () => {
  it("converte ida e volta sem depender do fuso do dispositivo", () => {
    assert.equal(
      publicationInputToIso("2026-09-29T14:30"),
      "2026-09-29T17:30:00.000Z",
    );
    assert.equal(
      publicationInputValue("2026-09-29T17:30:00.000Z"),
      "2026-09-29T14:30",
    );
    assert.equal(
      publicationInputToIso("2026-09-29T23:30"),
      "2026-09-30T02:30:00.000Z",
    );
    assert.equal(publicationInputToIso(""), null);
    assert.equal(publicationInputValue(null), "");
  });
  it("rejeita datas inexistentes ou incompletas", () => {
    for (const date of [
      "2026-02-30T14:30",
      "2026-09-29",
      "2026-09-29T25:00",
      "invalid",
    ]) {
      assert.throws(() => publicationInputToIso(date));
    }
  });
  it("aceita apenas horários futuros de meia em meia hora", () => {
    for (const date of [
      "2026-09-29T12:30:00.000Z",
      "2026-09-29T13:00:00.000Z",
    ]) {
      assert.equal(validatePublicationTime(date, now), null);
    }
    for (const date of [
      "2026-09-29T11:30:00.000Z",
      now.toISOString(),
      "2026-09-29T13:10:00.000Z",
      "2026-09-29T13:30:01.000Z",
      "2026-09-29T13:30:00.001Z",
      "invalid",
    ]) {
      assert.ok(validatePublicationTime(date, now));
    }
  });
});

describe("contrato administrativo de publicação", () => {
  it("aceita registros antigos, cancelamento e agendamento futuro", () => {
    assert.equal(adminSpeakerInputSchema.safeParse(base).success, true);
    assert.equal(
      adminSpeakerInputSchema.parse({ ...base, publishAt: null }).publishAt,
      null,
    );
    assert.equal(
      adminSpeakerInputSchema.parse({
        ...base,
        publishAt: "2099-09-29T17:30:00.000Z",
      }).publishAt,
      "2099-09-29T17:30:00.000Z",
    );
  });
  it("bloqueia data passada, fora do intervalo e palestrante já visível", () => {
    assert.equal(
      adminSpeakerInputSchema.safeParse({
        ...base,
        publishAt: "2000-01-01T12:00:00.000Z",
      }).success,
      false,
    );
    assert.equal(
      adminSpeakerInputSchema.safeParse({
        ...base,
        publishAt: "2099-09-29T17:10:00.000Z",
      }).success,
      false,
    );
    assert.equal(
      adminSpeakerInputSchema.safeParse({
        ...base,
        isVisible: true,
        publishAt: "2099-09-29T17:30:00.000Z",
      }).success,
      false,
    );
  });
  it("mantém os metadados fora do contrato compartilhado com a Pokédex", () => {
    assert.equal(
      speakerCreateSchema.safeParse({ ...base, publishAt: null }).success,
      false,
    );
  });
  it("valida a data local no formulário e permite removê-la", () => {
    const form = {
      ...base,
      company: "",
      title: "",
      miniBio: "",
      photoUrl: "",
      socialMedia: { instagram: "", linkedIn: "" },
      publishAt: "2099-09-29T14:30",
    };
    assert.equal(speakerFormSchema.safeParse(form).success, true);
    assert.equal(
      speakerFormSchema.safeParse({ ...form, publishAt: "" }).success,
      true,
    );
    assert.equal(
      speakerFormSchema.safeParse({ ...form, publishAt: "2099-09-29T14:10" })
        .success,
      false,
    );
  });
});
