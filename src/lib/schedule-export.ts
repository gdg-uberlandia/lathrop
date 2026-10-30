import { SCHEDULE_TRACK_STYLES } from "./schedule-presentation";
import {
  buildScheduleExportPages,
  EXPORT_FONTS,
  EXPORT_HEIGHT,
  EXPORT_LINE_HEIGHT,
  EXPORT_WIDTH,
  type ExportPage,
  type ScheduleExportRow,
} from "./schedule-export-layout";
export type { ScheduleExportRow } from "./schedule-export-layout";

const filename = (extension: string) => `programacao-devfest.${extension}`;
const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};
const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export function exportScheduleCsv(rows: ScheduleExportRow[]) {
  const content = [
    ["Horário", "Trilha", "Tipo", "Atividade", "Palestrantes"],
    ...rows.map((row) => [
      row.time,
      row.track,
      row.type,
      row.title,
      row.speakers,
    ]),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
  download(
    new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }),
    filename("csv"),
  );
}

function roundedBox(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function renderPage(
  page: ExportPage,
  number: number,
  total: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error("Não foi possível gerar a imagem da programação.");
  context.fillStyle = "#020617";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff";
  context.font = "bold 40px Arial";
  context.fillText("Programação do evento", 56, 74);
  context.font = "20px Arial";
  context.fillStyle = "#94a3b8";
  context.fillText(
    "Confira os horários, trilhas e conteúdos do DevFest Triângulo.",
    56,
    112,
  );
  for (const slot of page.slots) {
    context.font = "bold 24px Arial";
    context.fillStyle = "#e2e8f0";
    context.fillText(slot.time, 56, slot.y + 24);
    context.font = "18px Arial";
    context.fillStyle = "#94a3b8";
    context.fillText(slot.date, 280, slot.y + 24);
  }
  for (const card of page.cards) {
    const color = card.row.trackId
      ? SCHEDULE_TRACK_STYLES[card.row.trackId].color
      : "#cbd5e1";
    roundedBox(context, card.x, card.y, card.width, card.height, 22);
    context.fillStyle = "#ffffff0d";
    context.fill();
    context.strokeStyle = card.row.trackId ? `${color}80` : "#ffffff26";
    context.lineWidth = 1.5;
    context.stroke();
    const label = (
      card.row.trackId ? card.row.track : card.row.type
    ).toLocaleUpperCase("pt-BR");
    context.font = "bold 16px Arial";
    const badgeWidth = Math.min(
      card.width - 40,
      context.measureText(label).width + 28,
    );
    roundedBox(context, card.x + 20, card.y + 20, badgeWidth, 32, 16);
    context.fillStyle = `${color}26`;
    context.fill();
    context.fillStyle = color;
    context.fillText(label, card.x + 34, card.y + 42, badgeWidth - 28);
    if (card.continued) {
      context.font = "14px Arial";
      context.fillStyle = "#94a3b8";
      context.fillText("continuação", card.x + 20, card.y + 70);
    }
    let y = card.y + 91;
    for (const line of card.lines) {
      context.font = EXPORT_FONTS[line.kind];
      context.fillStyle =
        line.kind === "title"
          ? "#ffffff"
          : line.kind === "body"
            ? "#94a3b8"
            : "#e2e8f0";
      context.fillText(line.text, card.x + 20, y);
      y += EXPORT_LINE_HEIGHT;
    }
  }
  context.font = "16px Arial";
  context.fillStyle = "#64748b";
  context.fillText("DevFest Triângulo", 56, EXPORT_HEIGHT - 24);
  context.textAlign = "right";
  context.fillText(
    `${number} / ${total}`,
    EXPORT_WIDTH - 56,
    EXPORT_HEIGHT - 24,
  );
  return canvas;
}

function exportPages(rows: ScheduleExportRow[]) {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) throw new Error("Não foi possível preparar a exportação.");
  return buildScheduleExportPages(rows, (text, kind) => {
    context.font = EXPORT_FONTS[kind];
    return context.measureText(text).width;
  });
}

export async function exportSchedulePdf(rows: ScheduleExportRow[]) {
  const { jsPDF } = await import("jspdf");
  const pages = exportPages(rows);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  pages.forEach((page, index) => {
    if (index) pdf.addPage();
    const canvas = renderPage(page, index + 1, pages.length);
    pdf.addImage(canvas, "PNG", 0, 0, 297, 210);
    canvas.width = canvas.height = 0;
  });
  pdf.save(filename("pdf"));
}

export function exportSchedulePng(rows: ScheduleExportRow[]) {
  const pages = exportPages(rows);
  // Each image has the same A4 landscape dimensions as one PDF page.
  pages.forEach((page, index) => {
    const canvas = renderPage(page, index + 1, pages.length);
    const name =
      pages.length > 1
        ? `programacao-devfest-${index + 1}.png`
        : filename("png");
    canvas.toBlob((blob) => {
      if (blob) download(blob, name);
      canvas.width = canvas.height = 0;
    }, "image/png");
  });
}
