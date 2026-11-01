import assert from "node:assert/strict";
import { test } from "node:test";
import { selectDashboardContext } from "./dashboard-context";
import { buildRatingAnalysis } from "./rating-analysis";
test("avaliações preservam tamanho da amostra, distribuição e rejeitam notas inválidas", () => {
  const c = selectDashboardContext({
    profiles: [{ id: "a" }, { id: "b" }],
    talks: [{ id: "t", title: "Talk" }, { id: "empty" }],
    "talk-ratings": [
      {
        id: "r1",
        participantId: "a",
        talkId: "t",
        completedAt: "2026-10-31T12:00:00Z",
        contentRating: 5,
      },
      {
        id: "r2",
        participantId: "b",
        talkId: "t",
        completedAt: "2026-10-31T12:00:00Z",
        contentRating: 3,
      },
      {
        id: "bad",
        participantId: "b",
        talkId: "t",
        completedAt: "2026-10-31T12:00:00Z",
        contentRating: 9,
      },
    ],
  });
  const d = buildRatingAnalysis(c);
  assert.equal(d.talks[0].reviewers, 2);
  assert.equal(d.talks[0].dimensions.contentRating.mean, 4);
  assert.equal(d.talks[0].dimensions.contentRating.deviation, 1);
  assert.equal(d.talks[0].dimensions.contentRating.distribution[4].count, 1);
  assert.equal(d.talks[1].dimensions.contentRating.mean, null);
});
