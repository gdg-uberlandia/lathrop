import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPokedexDashboard } from "./pokedex-dashboard";
test("resumo automático usa números calculados e não inventa pico ou demanda em recorte vazio", () => {
  const d = buildPokedexDashboard({ profiles: [] });
  assert.equal(
    d.resultSummary.some((i) => i.id === "peak"),
    false,
  );
  assert.equal(
    d.resultSummary.some((i) => i.id === "reward"),
    false,
  );
  assert.equal(JSON.stringify(d.resultSummary).includes("NaN"), false);
  assert.equal(
    d.resultSummary
      .find((i) => i.id === "ratings")
      ?.text.includes("0 avaliações"),
    true,
  );
});
test("resumo identifica o pico e a cobertura sem confundir avaliações com pessoas", () => {
  const d = buildPokedexDashboard({
    profiles: [{ id: "a", ticketBalance: 0 }],
    talks: [{ id: "t", title: "Talk" }],
    "talk-ratings": [
      {
        id: "r",
        participantId: "a",
        talkId: "t",
        completedAt: "2026-10-31T08:00:00-03:00",
        speakerRating: 5,
        contentRating: 5,
        comprehensionRating: 5,
      },
    ],
  });
  assert.equal(
    d.resultSummary.find((i) => i.id === "peak")?.text.includes("às 08h"),
    true,
  );
  assert.equal(
    d.resultSummary.find((i) => i.id === "ratings")?.text.includes("1 pessoa"),
    true,
  );
});
