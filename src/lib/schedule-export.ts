export type ScheduleExportRow = {
  time: string;
  track: string;
  type: string;
  title: string;
  speakers: string;
};

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

export async function exportSchedulePdf(rows: ScheduleExportRow[]) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.setFontSize(18);
  pdf.text("Programação DevFest Triângulo", 14, 18);
  pdf.setFontSize(9);
  let y = 28;
  for (const row of rows) {
    const lines = pdf.splitTextToSize(
      `${row.time} | ${row.track} | ${row.title}${row.speakers ? ` — ${row.speakers}` : ""}`,
      180,
    );
    if (y + lines.length * 5 > 285) {
      pdf.addPage();
      y = 18;
    }
    pdf.text(lines, 14, y);
    y += lines.length * 5 + 2;
  }
  pdf.save(filename("pdf"));
}

export function exportSchedulePng(rows: ScheduleExportRow[]) {
  const width = 1600;
  const rowHeight = 58;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.max(300, 130 + rows.length * rowHeight);
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#0f172a";
  context.font = "bold 32px sans-serif";
  context.fillText("Programação DevFest Triângulo", 48, 58);
  context.font = "18px sans-serif";
  rows.forEach((row, index) => {
    const y = 110 + index * rowHeight;
    context.fillStyle = index % 2 ? "#f8fafc" : "#ffffff";
    context.fillRect(32, y - 28, width - 64, rowHeight);
    context.fillStyle = "#334155";
    context.fillText(`${row.time}  ·  ${row.track}`, 48, y);
    context.fillStyle = "#0f172a";
    context.fillText(
      `${row.title}${row.speakers ? ` — ${row.speakers}` : ""}`.slice(0, 105),
      400,
      y,
    );
  });
  canvas.toBlob((blob) => blob && download(blob, filename("png")), "image/png");
}
