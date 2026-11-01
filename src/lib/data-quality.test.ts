import assert from "node:assert/strict";
import { test } from "node:test";
import { selectDashboardContext } from "./dashboard-context";
import { buildDataQuality } from "./data-quality";
test("qualidade detecta duplicação, órfãos e saldos por perfil sem somar pré-evento como atividade", () => {
  const data = buildDataQuality(
    selectDashboardContext({
      profiles: [
        { id: "a", ticketBalance: 5 },
        { id: "b", ticketBalance: -5 },
      ],
      ticketTransactions: [
        {
          id: "t",
          participantId: "a",
          ticketDelta: 4,
          createdAt: "2026-10-31T12:00:00Z",
        },
      ],
      activityCompletions: [
        {
          id: "early",
          participantId: "gone",
          activityType: "mission",
          activityId: "missing",
          completedAt: "2026-10-31T07:00:00-03:00",
        },
        {
          id: "orphan",
          participantId: "gone",
          completedAt: "2026-10-31T12:00:00Z",
        },
        ...["x", "y"].map((id) => ({
          id,
          participantId: "a",
          activityType: "mission",
          activityId: "m",
          completedAt: "2026-10-31T12:00:00Z",
        })),
      ],
      missions: [{ id: "m" }],
    }),
  );
  assert.equal(
    data.checks.find((q) => q.code === "duplicate-actions")?.count,
    1,
  );
  assert.equal(data.checks.find((q) => q.code === "orphan-profiles")?.count, 1);
  assert.equal(data.checks.find((q) => q.code === "ticket-balances")?.count, 2);
  assert.equal(
    data.checks
      .find((q) => q.code === "orphan-profiles")
      ?.examples.some((e) => e.id === "early"),
    false,
  );
});
test("qualidade não atribui registros órfãos a um papel selecionado", () => {
  const d = buildDataQuality(
    selectDashboardContext(
      {
        profiles: [],
        ticketTransactions: [
          { id: "x", participantId: "gone", createdAt: "2026-10-31T12:00:00Z" },
        ],
      },
      { role: "participant" },
    ),
  );
  assert.equal(d.checks.find((q) => q.code === "orphan-profiles")?.count, 0);
});
