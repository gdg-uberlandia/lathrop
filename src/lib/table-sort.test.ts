import assert from "node:assert/strict";
import { test } from "node:test";
import { tableSortValue, compareTableValues } from "./table-sort";
test("ordenação entende números brasileiros, percentuais e datas de Brasília", () => {
  assert.equal(tableSortValue("1.234"), 1234);
  assert.equal(tableSortValue("4,97%"), 4.97);
  assert.equal(tableSortValue("−15"), -15);
  assert.equal(
    compareTableValues(
      tableSortValue("02/11/2026, 08:00:00"),
      tableSortValue("31/10/2026, 20:00:00"),
      "asc",
    ) > 0,
    true,
  );
  assert.equal(compareTableValues(2, 10, "asc") < 0, true);
  assert.equal(compareTableValues(null, 10, "desc"), 1);
});
