import type { PokedexDashboard } from "./pokedex-dashboard";
import { dashboardCsv } from "./dashboard-csv";
export const DASHBOARD_REPORT_TABS = [
  "Visão geral",
  "Resumo",
  "Engajamento",
  "Jornada",
  "Rede de conexões",
  "Afinidade",
  "Empresas",
  "Brindes e tickets",
  "Demanda por brindes",
  "Avaliações",
  "Ganhadores",
] as const;
type BarChart = {
  type: "bar";
  title: string;
  unit: string;
  items: { label: string; value: number }[];
};
type HeatmapChart = {
  type: "heatmap";
  title: string;
  columns: string[];
  rows: string[];
  values: number[][];
};
export type DashboardReportSection = {
  title: string;
  description: string;
  columns: string[];
  rows: (string | number)[][];
  charts: (BarChart | HeatmapChart)[];
  tables?: { title: string; columns: string[]; rows: (string | number)[][] }[];
};
export type DashboardReport = {
  title: string;
  metadata: string[];
  sections: DashboardReportSection[];
};
const n = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
const score = (v: number | null) => (v === null ? "—" : n(v));
export function buildDashboardReport(
  d: PokedexDashboard,
  scope = "all",
): DashboardReport {
  const metadata = [
    `Evento: ${d.eventId}`,
    `Ambiente: ${d.environment}`,
    `Dados consultados em ${new Date(d.updatedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
    `Base: somente participantes · Ações desde 31/10/2026 às 08h (Brasília)`,
  ];
  const bar = (
    title: string,
    unit: string,
    items: { label: string; value: number }[],
  ): BarChart => ({ type: "bar", title, unit, items });
  const section = (
    title: string,
    description: string,
    columns: string[],
    rows: (string | number)[][],
    charts: DashboardReportSection["charts"] = [],
  ): DashboardReportSection => ({ title, description, columns, rows, charts });
  const company = d.companyReach.companies.find(
    (c) => c.id === scope || `company:${c.id}` === scope,
  );
  if (company)
    return {
      title: `Relatório de alcance — ${company.name}`,
      metadata,
      sections: [
        section(
          "Empresas",
          `Visitantes únicos: ${company.visitors} de ${d.base.profiles} participantes (${n(company.reach)}%). Visitas são registros na Pokédex, não tempo no estande.`,
          ["Horário de Brasília", "Visitantes únicos"],
          company.hourly.map((h) => [h.hour.replace("T", " ") + "h", h.people]),
          [
            bar(
              "Visitantes por horário",
              "pessoas",
              company.hourly.map((h) => ({
                label: h.hour.replace("T", " ") + "h",
                value: h.people,
              })),
            ),
          ],
        ),
        section(
          "Visitantes em comum",
          "Percentuais sobre os visitantes desta empresa. Uma pessoa pode aparecer em mais de uma linha.",
          ["Empresa", "Pessoas", "% dos visitantes"],
          company.overlaps.map((o) => [o.name, o.people, n(o.percent) + "%"]),
        ),
      ],
    };
  if (scope !== "all" && !DASHBOARD_REPORT_TABS.some((tab) => tab === scope))
    throw Error("Aba ou empresa não encontrada.");
  const summaries = d.resultSummary;
  const sections = [
    section(
      "Visão geral",
      "Pessoas únicas e ações registradas após a abertura do evento.",
      ["Indicador", "Valor"],
      [
        ["Participantes cadastrados", d.base.profiles],
        ["Participantes ativos", d.metrics.active],
        ["Onboarding concluído (atual)", d.base.onboarded],
        ["Atividades concluídas", d.metrics.activities],
        ["Conexões aceitas", d.metrics.connections],
        ["Pessoas que resgataram", d.metrics.redeemers],
      ],
      d.heatmap.map((day) => ({
        type: "heatmap" as const,
        title: `Mapa de calor · ${day.day.split("-").reverse().join("/")}`,
        columns: day.hours.map((h) => `${String(h).padStart(2, "0")}h`),
        rows: [
          "Missões",
          "Empresas",
          "Tags",
          "Conexões",
          "Avaliações",
          "Brindes",
        ],
        values: [
          "mission",
          "company",
          "tag",
          "connection",
          "rating",
          "redemption",
        ].map((kind) =>
          day.hours.map(
            (hour) =>
              day.cells.find((c) => c.kind === kind && c.hour === hour)
                ?.actions ?? 0,
          ),
        ),
      })),
    ),
    section(
      "Resumo",
      "Fatos calculados sobre a mesma base das abas, com metodologia explícita.",
      ["Resultado", "Análise", "Base de comparação"],
      summaries.map((i) => [i.title, i.text, i.evidence]),
      [
        bar("Participação na base", "pessoas", [
          { label: "Ativos", value: d.metrics.active },
          {
            label: "Sem ações",
            value: Math.max(0, d.base.profiles - d.metrics.active),
          },
        ]),
      ],
    ),
    section(
      "Engajamento",
      `Mediana: ${n(d.engagement.median)} ações. P90: ${n(d.engagement.p90)}. Grupo mais ativo (${d.engagement.topCount} pessoas): ${n(d.engagement.topShare)}% das participações.`,
      ["Faixa de ações", "Participantes", "% da base"],
      d.engagement.bands.map((b) => [b.label, b.people, n(b.percent) + "%"]),
      [
        bar(
          "Distribuição das participações",
          "pessoas",
          d.engagement.bands.map((b) => ({ label: b.label, value: b.people })),
        ),
        bar(
          "XP recebido no evento",
          "pessoas",
          d.xpBands.map((b) => ({ label: b.label, value: b.count })),
        ),
      ],
    ),
    section(
      "Jornada",
      "Marcos independentes; não representam um funil obrigatório. Onboarding é um estado atual do perfil.",
      ["Marco", "Participantes", "% da base"],
      d.journey.stages.map((s) => [s.label, s.people, n(s.percent) + "%"]),
      [
        bar(
          "Participação por marco",
          "pessoas",
          d.journey.stages.map((s) => ({ label: s.label, value: s.people })),
        ),
      ],
    ),
    section(
      "Rede de conexões",
      "Rede entre participantes, sem disposição espacial ilustrativa. Pares repetidos são deduplicados.",
      ["Indicador", "Valor"],
      [
        ["Pares únicos", d.network.edges],
        ["Participantes conectados", d.network.connected],
        ["Sem conexões", d.network.isolated],
        ["Grupos conectados", d.network.components],
        ["Maior grupo", d.network.largestComponent],
        ["Média de conexões", n(d.network.averageDegree)],
      ],
      [
        bar("Participação no networking", "pessoas", [
          { label: "Com conexões", value: d.network.connected },
          { label: "Sem conexões", value: d.network.isolated },
        ]),
      ],
    ),
    section(
      "Afinidade",
      "Interesses e habilidades declarados. Uma pessoa pode pertencer a vários grupos; associação não demonstra causa.",
      [
        "Interesse",
        "Pessoas",
        "Missões %",
        "Empresas %",
        "Tags %",
        "Conexões %",
        "Avaliações %",
        "Brindes %",
      ],
      d.affinity.interests.map((i) => [
        i.label,
        i.people,
        ...i.actions.map((a) => n(a.rate) + "%"),
      ]),
      [
        bar(
          "Interesses mais declarados (até 20)",
          "pessoas",
          d.affinity.interests
            .slice(0, 20)
            .map((i) => ({ label: i.label, value: i.people })),
        ),
      ],
    ),
    section(
      "Empresas",
      "Visitantes únicos por estande. Não some visitantes de empresas diferentes como pessoas únicas do evento.",
      ["Empresa", "Visitantes únicos", "% da base"],
      d.companyReach.companies.map((c) => [
        c.name,
        c.visitors,
        n(c.reach) + "%",
      ]),
      [
        bar(
          "Alcance por empresa",
          "pessoas",
          d.companyReach.companies.map((c) => ({
            label: c.name,
            value: c.visitors,
          })),
        ),
      ],
    ),
    section(
      "Brindes e tickets",
      `Movimentos do evento. Saldo atual: ${n(d.base.ticketBalance)} tickets. Estoques são atuais, conforme o CRUD.`,
      ["Movimentação", "Direção", "Tickets", "Movimentos", "Pessoas"],
      d.ticketFlow.movements.map((m) => [
        m.label,
        m.direction === "out"
          ? "Saída"
          : m.direction === "in"
            ? "Entrada"
            : "Sem alteração",
        m.amount,
        m.transactions,
        m.people,
      ]),
      [
        bar(
          "Origens e destinos de tickets",
          "tickets",
          d.ticketFlow.movements.map((m) => ({
            label: `${m.direction === "out" ? "Saída" : "Entrada"} · ${m.label}`,
            value: m.amount,
          })),
        ),
      ],
    ),
    section(
      "Demanda por brindes",
      `Janela observada: ${n(d.rewardDemand.observedHours)} horas entre primeiro e último resgate, mínimo de uma hora. Não é previsão de demanda.`,
      [
        "Brinde",
        "Unidades",
        "Pessoas",
        "Tickets gastos",
        "Unidades/h",
        "Estoque atual",
      ],
      d.rewardDemand.rewards.map((r) => [
        r.name,
        r.units,
        r.people,
        r.ticketsSpent,
        n(r.unitsPerHour),
        r.stock ?? "Indisponível",
      ]),
      [
        bar(
          "Unidades resgatadas por brinde",
          "unidades",
          d.rewardDemand.rewards.map((r) => ({
            label: r.name,
            value: r.units,
          })),
        ),
      ],
    ),
    section(
      "Avaliações",
      "Notas de 1 a 5. Médias devem ser lidas junto ao número de avaliadores. Comentários individuais são consultados no painel.",
      [
        "Palestra",
        "Avaliações",
        "Avaliadores",
        "Palestrante",
        "Conteúdo",
        "Compreensão",
      ],
      d.ratingAnalysis.talks.map((t) => [
        t.title,
        t.count,
        t.reviewers,
        score(t.dimensions.speakerRating.mean),
        score(t.dimensions.contentRating.mean),
        score(t.dimensions.comprehensionRating.mean),
      ]),
      [
        bar(
          "Palestras com mais avaliadores (até 20)",
          "pessoas",
          d.ratingAnalysis.talks
            .filter((t) => t.reviewers > 0)
            .slice(0, 20)
            .map((t) => ({ label: t.title, value: t.reviewers })),
        ),
      ],
    ),
    section(
      "Ganhadores",
      "Somente resultados confirmados. Esta aba contém nome e e-mail dos ganhadores para uso administrativo.",
      ["Prêmio", "Ganhador", "E-mail", "Confirmação (Brasília)"],
      d.winners.map((w) => [
        w.prizeName,
        w.name,
        w.email ?? "Perfil indisponível",
        new Date(w.confirmedAt).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      ]),
    ),
  ];
  const ticketSection = sections.find(
    (section) => section.title === "Brindes e tickets",
  )!;
  ticketSection.tables = [
    {
      title: "Catálogo atual de brindes",
      columns: [
        "Brinde",
        "Disponibilidade",
        "Estoque",
        "Unidades resgatadas",
        "Tickets gastos",
      ],
      rows: d.rewards
        .filter((r) => !r.deleted)
        .map((r) => [
          r.name,
          r.active ? "Ativo" : "Inativo",
          r.stock,
          r.redeemed,
          r.ticketsSpent,
        ]),
    },
  ];
  return {
    title:
      scope === "all"
        ? "Relatório da Pokédex — todas as abas"
        : `Pokédex — ${scope}`,
    metadata,
    sections:
      scope === "all" ? sections : sections.filter((s) => s.title === scope),
  };
}
export function dashboardReportCsv(report: DashboardReport) {
  const rows: unknown[][] = [
    ["Aba", "Registro", "Linha", "Coluna", "Valor"],
    ["Contexto", "Título", "", "", report.title],
    ...report.metadata.map((m) => ["Contexto", "Metadado", "", "", m]),
  ];
  for (const s of report.sections) {
    rows.push([s.title, "Metodologia", "", "", s.description]);
    s.rows.forEach((row, i) =>
      row.forEach((value, j) =>
        rows.push([s.title, "Tabela", i + 1, s.columns[j], value]),
      ),
    );
    for (const table of s.tables ?? [])
      table.rows.forEach((row, i) =>
        row.forEach((value, j) =>
          rows.push([s.title, table.title, i + 1, table.columns[j], value]),
        ),
      );
    for (const chart of s.charts) {
      if (chart.type === "heatmap")
        chart.values.forEach((values, i) =>
          values.forEach((value, j) =>
            rows.push([
              s.title,
              chart.title,
              chart.rows[i],
              chart.columns[j],
              value,
            ]),
          ),
        );
      else
        chart.items.forEach((item) =>
          rows.push([s.title, chart.title, item.label, chart.unit, item.value]),
        );
    }
  }
  return dashboardCsv(rows);
}
export async function downloadDashboardReportPdf(report: DashboardReport) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const W = 297,
    H = 210,
    margin = 14,
    content = W - margin * 2;
  let y = margin;
  const clean = (text: string) => text.replace(/\u0000/g, "");
  const text = (value: string, size = 9, bold = false, width = content) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    return pdf.splitTextToSize(clean(value), width) as string[];
  };
  const heading = (title: string, subtitle?: string) => {
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, W, 23, "F");
    pdf.setTextColor(255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(title, margin, 15);
    pdf.setTextColor(51, 65, 85);
    y = 31;
    if (subtitle) {
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      const lines = text(subtitle, 8);
      pdf.text(lines, margin, y);
      y += lines.length * 3.8 + 5;
    }
  };
  const newPage = (title: string, subtitle?: string) => {
    pdf.addPage();
    heading(title, subtitle);
  };
  heading(report.title);
  for (const m of report.metadata) {
    const lines = text(m, 11);
    pdf.text(lines, margin, y);
    y += lines.length * 5 + 5;
  }
  y += 8;
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, y, content, 42, 3, 3, "F");
  pdf.setTextColor(30, 64, 175);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Conteúdo organizado pelas abas do dashboard", margin + 6, y + 10);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(
    text(
      report.sections.map((s) => s.title).join(" · "),
      9,
      false,
      content - 12,
    ),
    margin + 6,
    y + 19,
  );
  pdf.setTextColor(51, 65, 85);
  for (const section of report.sections) {
    newPage(section.title, section.description);
    for (const table of [
      { title: "", columns: section.columns, rows: section.rows },
      ...(section.tables ?? []),
    ]) {
      if (table.title) {
        if (y + 30 > H - 17) newPage(section.title, section.description);
        y += 7;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(table.title, margin, y);
        y += 8;
      }
      const cols = table.columns.length;
      const widths =
        cols === 2
          ? [content * 0.52, content * 0.48]
          : cols === 3
            ? [content * 0.34, content * 0.33, content * 0.33]
            : [
                content * 0.36,
                ...Array.from(
                  { length: cols - 1 },
                  () => (content * 0.64) / (cols - 1),
                ),
              ];
      const header = () => {
        pdf.setFillColor(226, 232, 240);
        pdf.rect(margin, y, content, 9, "F");
        let x = margin;
        table.columns.forEach((label, i) => {
          pdf.setTextColor(51, 65, 85);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.text(text(label, 8, true, widths[i] - 4), x + 2, y + 5);
          x += widths[i];
        });
        y += 11;
      };
      header();
      if (!table.rows.length) {
        pdf.setFontSize(9);
        pdf.text("Nenhum registro no evento para esta aba.", margin, y + 3);
        y += 12;
      }
      table.rows.forEach((row, index) => {
        const lines = row.map((v, i) =>
          text(String(v), 8, false, widths[i] - 4),
        );
        const height = Math.max(7, ...lines.map((l) => l.length * 3.7 + 4));
        if (y + height > H - 17) {
          newPage(`${section.title} · continuação`, section.description);
          header();
        }
        if (index % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin, y, content, height, "F");
        }
        let x = margin;
        pdf.setTextColor(30, 41, 59);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        lines.forEach((line, i) => {
          pdf.text(line, x + 2, y + 4);
          x += widths[i];
        });
        y += height;
      });
    }
    for (const chart of section.charts) {
      if (chart.type === "heatmap") {
        if (y + 65 > H - 17) newPage(section.title, section.description);
        y += 8;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(chart.title, margin, y);
        y += 9;
        const left = 37,
          cw = (content - left) / Math.max(1, chart.columns.length),
          max = Math.max(1, ...chart.values.flat());
        pdf.setFontSize(7);
        chart.columns.forEach((col, i) =>
          pdf.text(col, margin + left + i * cw + 1, y),
        );
        y += 3;
        chart.rows.forEach((label, i) => {
          pdf.setTextColor(51, 65, 85);
          pdf.text(label, margin, y + 5);
          chart.values[i].forEach((value, j) => {
            const fraction = value / max;
            pdf.setFillColor(
              ...((value
                ? [
                    Math.round(239 - 202 * fraction),
                    Math.round(246 - 147 * fraction),
                    Math.round(255 - 20 * fraction),
                  ]
                : [241, 245, 249]) as [number, number, number]),
            );
            pdf.rect(margin + left + j * cw, y, cw - 0.7, 7, "F");
            pdf.setTextColor(fraction > 0.6 ? 255 : 51);
            if (value)
              pdf.text(String(value), margin + left + j * cw + 1, y + 4.5);
          });
          y += 8;
        });
        pdf.setTextColor(100);
        pdf.setFontSize(7);
        pdf.text(
          `Ações por hora de Brasília · escala de 0 a ${max} · horários anteriores à abertura excluídos`,
          margin,
          y + 4,
        );
        y += 12;
      } else {
        if (!chart.items.length) continue;
        if (y + 30 > H - 17) newPage(section.title, section.description);
        y += 8;
        pdf.setTextColor(30, 41, 59);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(`${chart.title} (${chart.unit})`, margin, y);
        y += 9;
        const max = Math.max(1, ...chart.items.map((i) => i.value));
        for (const item of chart.items) {
          const labelLines = text(item.label, 7, false, 78),
            height = Math.max(9, labelLines.length * 3.5 + 3);
          if (y + height > H - 17) {
            newPage(section.title, section.description);
            pdf.setFontSize(10);
            pdf.text(chart.title, margin, y);
            y += 8;
          }
          pdf.setTextColor(51, 65, 85);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.text(labelLines, margin, y + 3);
          pdf.setFillColor(226, 232, 240);
          pdf.rect(margin + 81, y, content - 101, 5, "F");
          pdf.setFillColor(37, 99, 235);
          pdf.rect(
            margin + 81,
            y,
            ((content - 101) * item.value) / max,
            5,
            "F",
          );
          pdf.setTextColor(30, 41, 59);
          pdf.text(n(item.value), W - margin - 17, y + 4);
          y += height;
        }
      }
    }
  }
  const total = pdf.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100);
    pdf.setFontSize(7);
    pdf.text(
      `${report.metadata[0]} · Participantes · Desde 31/10/2026 às 08h`,
      margin,
      H - 7,
    );
    pdf.text(`${page} / ${total}`, W - margin, H - 7, { align: "right" });
  }
  pdf.save("relatorio-pokedex.pdf");
}
