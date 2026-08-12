import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const rules = readFileSync(
  new URL("../../firestore.rules", import.meta.url),
  "utf8",
);
describe("regras do Firestore", () => {
  it("bloqueia leitura e escrita direta nos catálogos para qualquer papel", () => {
    assert.match(rules, /match \/\{document=\*\*\}/);
    assert.match(rules, /allow read, write: if false/);
  });
  it("expõe somente a leitura do sinal mínimo do sorteio", () => {
    assert.match(rules, /match \/raffleLiveSignals\/\{eventId\}/);
    assert.match(rules, /allow read: if true/);
    assert.match(rules, /allow write: if false/);
  });
});
