import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isEventStatisticsTime,
  eventStatisticsHours,
  isEventStatisticsHour,
} from "./event-statistics-time";
test("abertura inclui 08h exatas de Brasília e exclui o instante anterior", () => {
  assert.equal(isEventStatisticsTime("2026-10-31T07:59:59.999-03:00"), false);
  assert.equal(isEventStatisticsTime("2026-10-31T08:00:00-03:00"), true);
  assert.equal(isEventStatisticsTime("2026-10-31T10:59:59.999Z"), false);
  assert.equal(isEventStatisticsTime("2026-10-31T11:00:00Z"), true);
  assert.equal(isEventStatisticsTime(undefined), false);
  assert.equal(isEventStatisticsTime("invalid"), false);
});
test("gráficos não exibem colunas anteriores à abertura e não inventam encerramento", () => {
  assert.deepEqual(eventStatisticsHours("2026-10-30"), []);
  assert.deepEqual(
    eventStatisticsHours("2026-10-31"),
    Array.from({ length: 16 }, (_, i) => i + 8),
  );
  assert.equal(isEventStatisticsHour("2026-10-31T07"), false);
  assert.equal(eventStatisticsHours("2026-11-01").length, 24);
});
