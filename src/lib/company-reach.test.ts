import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCompanyReach } from "./company-reach";
test("alcance deduplica visitas, preserva zero visitas e calcula sobreposição sobre a empresa selecionada", () => {
  const d = buildCompanyReach(
    ["a", "b", "c"],
    [
      { id: "one", name: "Um" },
      { id: "two", name: "Dois" },
      { id: "zero", name: "Zero" },
    ],
    [
      { companyId: "one", personId: "a", hour: "2026-10-31T09" },
      { companyId: "one", personId: "a", hour: "2026-10-31T09" },
      { companyId: "one", personId: "b", hour: "2026-10-31T10" },
      { companyId: "two", personId: "a", hour: "2026-10-31T10" },
      { companyId: "two", personId: "outside", hour: "2026-10-31T10" },
    ],
  );
  assert.equal(d.reached, 2);
  assert.equal(d.companies.find((c) => c.id === "one")?.visitors, 2);
  assert.equal(d.companies.find((c) => c.id === "one")?.hourly[0].people, 1);
  assert.equal(d.companies.find((c) => c.id === "zero")?.visitors, 0);
  assert.equal(
    d.companies.find((c) => c.id === "one")?.overlaps[0].percent,
    50,
  );
  assert.equal(
    d.coverage.reduce((s, c) => s + c.people, 0),
    3,
  );
  assert.equal(d.coverage[0].people, 1);
  assert.equal(d.averageCompanies, 1);
});
test("base vazia e empresa removida mantêm cálculo válido", () => {
  assert.equal(buildCompanyReach([], [], []).reach, 0);
  const d = buildCompanyReach(
    ["a"],
    [],
    [{ companyId: "removed", personId: "a", hour: "2026-10-31T09" }],
  );
  assert.equal(d.companies[0].name, "Empresa indisponível");
  assert.equal(d.reached, 1);
});
