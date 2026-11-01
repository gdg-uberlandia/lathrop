import type { PokedexDashboard } from "./pokedex-dashboard";
import { dashboardCsv } from "./dashboard-csv";
export type DashboardReport = {
  title: string;
  metadata: string[];
  sections: { title: string; rows: [string, string][] }[];
  chart: { label: string; value: number }[];
};
const n = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
export function buildDashboardReport(
  data: PokedexDashboard,
  companyId = "",
): DashboardReport {
  const metadata = [
    `Evento: ${data.eventId}`,
    `Ambiente: ${data.environment}`,
    `Dados consultados: ${new Date(data.updatedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
    `Período: ${data.filters.from || "31/10/2026 às 08h"} até ${data.filters.to || "último registro disponível"} (Brasília)`,
    `Papel: ${data.filters.role || "all"}`,
  ];
  const company = data.companyReach.companies.find((c) => c.id === companyId);
  if (companyId && !company) throw Error("Empresa não encontrada no recorte.");
  if (company)
    return {
      title: `Relatório de alcance — ${company.name}`,
      metadata,
      sections: [
        {
          title: "Indicadores de alcance",
          rows: [
            ["Visitantes únicos", n(company.visitors)],
            ["Base selecionada", n(data.base.profiles)],
            ["Alcance da base", `${n(company.reach)}%`],
          ],
        },
        {
          title: "Visitas por horário de Brasília",
          rows: company.hourly.map((h) => [
            h.hour.replace("T", " ") + "h",
            n(h.people),
          ]),
        },
        {
          title: "Visitantes em comum com outras empresas",
          rows: company.overlaps.map((o) => [
            o.name,
            `${n(o.people)} pessoas (${n(o.percent)}% dos visitantes desta empresa)`,
          ]),
        },
        {
          title: "Metodologia",
          rows: [
            [
              "Visitas",
              "Conclusões registradas na Pokédex; não medem permanência no estande.",
            ],
            [
              "Privacidade",
              "Relatório agregado, sem nomes ou e-mails de participantes.",
            ],
            [
              "Sobreposição",
              "A mesma pessoa pode aparecer em várias empresas.",
            ],
          ],
        },
      ],
      chart: company.hourly.map((h) => ({
        label: h.hour.replace("T", " ") + "h",
        value: h.people,
      })),
    };
  return {
    title: "Relatório da Pokédex",
    metadata,
    sections: [
      {
        title: "Participação no período",
        rows: [
          ["Base de perfis", n(data.base.profiles)],
          ["Pessoas ativas", n(data.metrics.active)],
          ["Atividades concluídas", n(data.metrics.activities)],
          ["Conexões aceitas", n(data.metrics.connections)],
          ["Pessoas que resgataram", n(data.metrics.redeemers)],
          ["Unidades resgatadas", n(data.metrics.redeemed)],
          [
            "Avaliações / avaliadores únicos",
            `${n(data.metrics.ratings)} / ${n(data.metrics.reviewers)}`,
          ],
        ],
      },
      {
        title: "Engajamento",
        rows: [
          ["Mediana de participações", n(data.engagement.median)],
          ["Percentil 90", n(data.engagement.p90)],
          [
            "Concentração no grupo mais ativo",
            `${n(data.engagement.topShare)}%`,
          ],
          ...data.engagement.bands.map((b): [string, string] => [
            b.label,
            `${n(b.people)} pessoas (${n(b.percent)}%)`,
          ]),
        ],
      },
      {
        title: "Alcance das empresas",
        rows: data.companyReach.companies.map((c) => [
          c.name,
          `${n(c.visitors)} visitantes (${n(c.reach)}% da base)`,
        ]),
      },
      {
        title: "Movimentos de tickets no período",
        rows: data.ticketFlow.movements.map((m) => [
          m.label,
          `${m.direction === "out" ? "-" : "+"}${n(m.amount)} tickets · ${n(m.transactions)} movimentos`,
        ]),
      },
      {
        title: "Resumo calculado",
        rows: data.resultSummary.map((i) => [
          i.title,
          `${i.text} Base: ${i.evidence}`,
        ]),
      },
      {
        title: "Rede de conexões",
        rows: [
          ["Pares únicos", n(data.network.edges)],
          ["Pessoas conectadas", n(data.network.connected)],
          ["Pessoas sem conexões", n(data.network.isolated)],
          ["Grupos conectados", n(data.network.components)],
        ],
      },
      {
        title: "Demanda por brindes",
        rows: data.rewardDemand.rewards.map((r) => [
          r.name,
          `${n(r.units)} unidades; ${n(r.people)} pessoas; ${n(r.unitsPerHour)} unidades/h na janela observada`,
        ]),
      },
      {
        title: "Jornada de participação",
        rows: data.journey.stages.map((s) => [
          s.label,
          `${n(s.people)} pessoas (${n(s.percent)}% da base)`,
        ]),
      },
      {
        title: "Avaliações",
        rows: data.ratingAnalysis.talks.map((t) => [
          t.title,
          `${n(t.reviewers)} avaliadores; ${n(t.count)} avaliações; médias: palestrante ${t.dimensions.speakerRating.mean === null ? "sem dados" : n(t.dimensions.speakerRating.mean)}, conteúdo ${t.dimensions.contentRating.mean === null ? "sem dados" : n(t.dimensions.contentRating.mean)}, compreensão ${t.dimensions.comprehensionRating.mean === null ? "sem dados" : n(t.dimensions.comprehensionRating.mean)}`,
        ]),
      },
      {
        title: "Afinidade entre interesses e ações",
        rows: data.affinity.interests.map((i) => [
          i.label,
          `${n(i.people)} pessoas; comparação com ${n(i.comparisonPeople)} de outros interesses declarados. ${i.actions.map((a) => `${a.kind}: ${n(a.rate)}% no grupo${a.comparisonRate === null ? "; sem grupo de comparação" : ` vs. ${n(a.comparisonRate)}% na comparação`}`).join("; ")}`,
        ]),
      },
      {
        title: "Qualidade dos dados",
        rows: data.quality.checks.map((q) => [
          q.title,
          `${q.count} ${q.unit}; escopo: ${q.scope}`,
        ]),
      },
      {
        title: "Metodologia",
        rows: [
          [
            "Janela oficial",
            "Ações anteriores a 31/10/2026 às 08h de Brasília são excluídas.",
          ],
          [
            "Base",
            "Pré-cadastros permanecem na base; saldos são valores atuais.",
          ],
          [
            "Ativo",
            "Atividade concluída, conexão aceita, avaliação ou resgate no período.",
          ],
          [
            "Limites",
            "Associações não demonstram causa; avaliações não comprovam presença física.",
          ],
        ],
      },
    ],
    chart: data.companyReach.companies.map((c) => ({
      label: c.name,
      value: c.visitors,
    })),
  };
}
export function dashboardReportCsv(report: DashboardReport) {
  return dashboardCsv([
    ["Relatório", report.title, ""],
    ...report.metadata.map((m) => ["Contexto", m, ""]),
    ["Seção", "Indicador", "Valor"],
    ...report.sections.flatMap((s) =>
      s.rows.map(([label, value]) => [s.title, label, value]),
    ),
  ]);
}
export async function downloadDashboardReportPdf(report: DashboardReport) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  let y = 18;
  const add = (text: string, size = 10, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(text, 174) as string[];
    for (const line of lines) {
      if (y > 274) {
        pdf.addPage();
        y = 18;
      }
      pdf.text(line, 18, y);
      y += size * 0.45 + 1;
    }
    y += 2;
  };
  add(report.title, 18, true);
  report.metadata.forEach((m) => add(m, 9));
  for (const section of report.sections) {
    y += 4;
    add(section.title, 13, true);
    for (const [label, value] of section.rows) add(`${label}: ${value}`);
  }
  if (report.chart.length) {
    pdf.addPage();
    y = 18;
    add("Distribuição visual", 16, true);
    const max = Math.max(1, ...report.chart.map((r) => r.value));
    for (const row of report.chart) {
      if (y > 255) {
        pdf.addPage();
        y = 18;
      }
      add(`${row.label}: ${row.value}`, 9);
      pdf.setFillColor(37, 99, 235);
      pdf.rect(18, y, (174 * row.value) / max, 3, "F");
      y += 9;
    }
  }
  for (let i = 1; i <= pdf.getNumberOfPages(); i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(`${report.metadata[0]} · ${i}/${pdf.getNumberOfPages()}`, 18, 289);
  }
  pdf.save("relatorio-pokedex.pdf");
}
