import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPokedexDashboard } from "./pokedex-dashboard";
import { buildDashboardReport, dashboardReportCsv } from "./dashboard-report";
test("relatório de empresa respeita escopo e não exporta identidade de participantes", () => {
  const data = {
    ...buildPokedexDashboard({
      profiles: [
        { id: "a", displayName: "Nome privado", email: "privado@example.com" },
      ],
      companies: [
        { id: "one", name: "Empresa Um" },
        { id: "two", name: "Empresa Dois" },
      ],
    }),
    eventId: "event",
    environment: "Teste",
    updatedAt: "2026-11-01T12:00:00Z",
  };
  const report = buildDashboardReport(data, "one");
  const serialized = dashboardReportCsv(report);
  assert.equal(serialized.includes("Empresa Um"), true);
  assert.equal(serialized.includes("privado@example.com"), false);
  assert.equal(serialized.includes("Nome privado"), false);
  assert.throws(() => buildDashboardReport(data, "missing"));
});
