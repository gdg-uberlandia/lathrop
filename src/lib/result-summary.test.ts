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

test("resumo identifica o denominador de comparação da afinidade, não só seus participantes ativos", () => {
  const profiles = Array.from({ length: 40 }, (_, i) => ({
    id: String(i),
    interests: [i < 20 ? "web" : "cloud"],
    ticketBalance: 0,
  }));
  const activeProfiles = profiles.slice(0, 20);
  const d = buildPokedexDashboard({
    profiles,
    activityCompletions: activeProfiles.map((p) => ({
      id: p.id,
      participantId: p.id,
      activityType: "mission",
      activityId: "m",
      completedAt: "2026-10-31T12:00:00Z",
    })),
    missions: [{ id: "m" }],
  });
  assert.equal(
    d.resultSummary
      .find((i) => i.id === "affinity")
      ?.evidence.includes("Grupos de 20 e 20 pessoas"),
    true,
  );
});
