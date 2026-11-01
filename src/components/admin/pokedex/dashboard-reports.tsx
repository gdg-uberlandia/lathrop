import { useState } from "react";
import { Button } from "@/assets/components/ui/button";
import type { PokedexDashboard } from "@/lib/pokedex-dashboard";
import {
  buildDashboardReport,
  dashboardReportCsv,
  downloadDashboardReportPdf,
} from "@/lib/dashboard-report";
import { Panel } from "./dashboard-ui";
export function DashboardReports({ data }: { data: PokedexDashboard }) {
  const [company, setCompany] = useState(""),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function download(format: "csv" | "pdf") {
    setPending(true);
    setError("");
    try {
      const report = buildDashboardReport(data, company);
      if (format === "pdf") await downloadDashboardReportPdf(report);
      else {
        const url = URL.createObjectURL(
          new Blob([dashboardReportCsv(report)], {
            type: "text/csv;charset=utf-8;",
          }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = company
          ? "relatorio-empresa-pokedex.csv"
          : "relatorio-evento-pokedex.csv";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erro ao exportar o relatório.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Panel
      title="Relatórios do evento e das empresas"
      description="Exporte indicadores agregados em CSV ou PDF com o período, papel, ambiente e horário da consulta. Não inclui nomes nem e-mails de participantes."
    >
      <label className="block text-sm text-slate-600">
        Conteúdo do relatório
        <select
          className="ml-3 rounded-lg border border-slate-300 bg-white p-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        >
          <option value="">Visão geral do evento</option>
          {data.companyReach.companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-4 flex gap-3">
        <Button disabled={pending} onClick={() => void download("csv")}>
          Exportar CSV
        </Button>
        <Button
          variant="outline"
          disabled={pending}
          onClick={() => void download("pdf")}
        >
          {pending ? "Preparando…" : "Exportar PDF"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <p className="mt-4 text-xs text-slate-500">
        O relatório usa os filtros já aplicados ao dashboard. Escolher uma
        empresa restringe o conteúdo exportado, sem alterar os filtros da tela.
      </p>
    </Panel>
  );
}
