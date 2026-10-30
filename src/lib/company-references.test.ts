import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isCompanyReferenced } from "./companies/references";

describe("referências de companies", () => {
  it("identifica company usada por missão", () => {
    assert.equal(
      isCompanyReferenced(
        [{ prerequisites: [{ type: "company", activityId: "acme" }] }],
        "acme",
      ),
      true,
    );
  });
  it("ignora referências de outro tipo", () => {
    assert.equal(
      isCompanyReferenced(
        [{ prerequisites: [{ type: "mission", activityId: "acme" }] }],
        "acme",
      ),
      false,
    );
  });
});

it("identifica a empresa responsável mesmo sem pré-requisitos", () => {
  assert.equal(
    isCompanyReferenced([{ companyId: "acme", prerequisites: [] }], "acme"),
    true,
  );
  assert.equal(isCompanyReferenced([{ companyId: "other" }], "acme"), false);
});
