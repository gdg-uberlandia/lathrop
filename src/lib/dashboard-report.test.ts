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

test("relatórios têm uma seção por aba, gráficos locais e não incluem qualidade removida", () => {
  const d = {
    ...buildPokedexDashboard({ profiles: [] }),
    eventId: "event",
    environment: "Teste",
    updatedAt: "2026-11-01T12:00:00Z",
  };
  const full = buildDashboardReport(d);
  assert.equal(full.sections.length, 9);
  assert.equal(
    full.sections.some((s) => s.title === "Qualidade dos dados"),
    false,
  );
  const demand = buildDashboardReport(d, "Demanda por brindes");
  assert.equal(demand.sections.length, 1);
  assert.equal(demand.sections[0].charts[0].type, "bar");
  assert.equal(
    buildDashboardReport(d, "Avaliações").sections[0].columns.includes(
      "Avaliadores",
    ),
    true,
  );
  assert.equal(
    buildDashboardReport(d, "Ganhadores").sections[0].columns.includes(
      "E-mail",
    ),
    true,
  );
});

test("relatório de brindes inclui catálogo atual e preserva excluídos apenas nos resgates históricos", () => {
  const d = {
    ...buildPokedexDashboard({
      rewards: [
        { id: "active", name: "Ativo", stock: 5, active: true },
        {
          id: "deleted",
          name: "Arquivado",
          stock: 5,
          deletedAt: "2026-11-01T00:00:00Z",
        },
      ],
    }),
    eventId: "event",
    environment: "Teste",
    updatedAt: "2026-11-01T12:00:00Z",
  };
  const section = buildDashboardReport(d, "Brindes e tickets").sections[0];
  assert.equal(section.tables?.[0].rows.length, 1);
  assert.equal(section.tables?.[0].rows[0][0], "Ativo");
  assert.equal(d.rewards.find((r) => r.id === "deleted")?.name, "Arquivado");
});

test("nomes acompanham o tipo e todas as folhas são A4 horizontais", async () => {
  const { createDashboardReportPdf, dashboardReportFilename } = await import(
    "./dashboard-report"
  );
  const report = buildDashboardReport(
    {
      ...buildPokedexDashboard({ profiles: [] }),
      eventId: "event",
      environment: "Teste",
      updatedAt: "2026-11-01T12:00:00Z",
    },
    "Avaliações",
  );
  assert.equal(
    dashboardReportFilename(report, "pdf"),
    "pokedex-avaliacoes.pdf",
  );
  assert.equal(
    dashboardReportFilename(report, "csv"),
    "pokedex-avaliacoes.csv",
  );
  const full = buildDashboardReport({
    ...buildPokedexDashboard({ profiles: [] }),
    eventId: "event",
    environment: "Teste",
    updatedAt: "2026-11-01T12:00:00Z",
  });
  const pdf = await createDashboardReportPdf(full);
  assert.ok(pdf.getNumberOfPages() >= full.sections.length + 1);
  for (let page = 1; page <= pdf.getNumberOfPages(); page++) {
    pdf.setPage(page);
    assert.ok(Math.abs(pdf.internal.pageSize.getWidth() - 297) < 1);
    assert.ok(Math.abs(pdf.internal.pageSize.getHeight() - 210) < 1);
  }
});
