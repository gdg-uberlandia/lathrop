export type PrintableQr = {
  key: string;
  kind: "Tag" | "Missão" | "Empresa";
  title: string;
  value: string;
  active: boolean;
};

export const QR_PRINT_MODELS = [
  {
    id: "dual-border",
    name: "Bordas roxa e amarela",
    description:
      "Fundo branco com duas bordas finas separadas por uma faixa branca.",
  },
  {
    id: "classic",
    name: "Pokédex clássica econômica",
    description:
      "Fundo branco e contornos pretos finos, ideal para impressão em quantidade.",
  },
  {
    id: "trainer",
    name: "Carta de treinador",
    description: "Amarelo, preto e branco com moldura de carta colecionável.",
  },
  {
    id: "research",
    name: "Terminal de pesquisa",
    description: "Moldura escura, linhas técnicas e detalhes amarelos.",
  },
] as const;
export type QrPrintModel = (typeof QR_PRINT_MODELS)[number]["id"];
export const QR_SAMPLE: PrintableQr = {
  key: "sample",
  kind: "Missão",
  title: "Explore a Pokédex",
  value: "13be3fb8-79ca-40c5-9d8b-ea323b215e91",
  active: true,
};

/** Fit text within a fixed-width area, wrapping at words and limiting line count. */
export function fitQrPrintText(
  value: string,
  initialSize: number,
  maxWidth: number,
  maxLines: number,
  measure: (text: string, size: number) => number,
) {
  for (let size = initialSize; size >= 1; size--) {
    const lines: string[] = [];
    let line = "";
    for (const word of value.trim().split(/\s+/u)) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(candidate, size) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) {
        lines.push(line);
        line = "";
      }
      // Split only words that cannot fit on a line by themselves.
      for (const char of word) {
        if (line && measure(line + char, size) > maxWidth) {
          lines.push(line);
          line = "";
        }
        line += char;
      }
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines) return { lines, size };
  }
  throw new Error("O texto excede a área de impressão.");
}

// A5 portrait, rasterized at 300 dpi for both preview and PDF export.
export async function renderQrPrint(
  item: PrintableQr,
  model: QrPrintModel,
  eventName: string,
) {
  const { default: QRCode } = await import("qrcode");
  const canvas = document.createElement("canvas");
  canvas.width = 1748;
  canvas.height = 2480;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error("Não foi possível preparar a impressão neste navegador.");
  ctx.scale(canvas.width / 740, canvas.height / 1050);
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    fill: string,
    stroke?: string,
    strokeWidth = 2,
  ) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  };
  const circle = (x: number, y: number, r: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };
  const text = (
    value: string,
    y: number,
    size: number,
    color: string,
    weight = 700,
    maxWidth = 600,
    maxLines = 3,
  ) => {
    const fitted = fitQrPrintText(
      value,
      size,
      maxWidth,
      maxLines,
      (text, fontSize) => {
        ctx.font = `${weight} ${fontSize}px Arial, sans-serif`;
        return ctx.measureText(text).width;
      },
    );
    const lines = fitted.lines;
    size = fitted.size;
    ctx.font = `${weight} ${size}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    lines.forEach((line, i) =>
      ctx.fillText(line, 370, y + (i - (lines.length - 1) / 2) * size * 1.25),
    );
  };
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 740, 1050);
  const dualBorder = model === "dual-border";
  const classic = model === "classic";
  const trainer = model === "trainer";
  box(
    18,
    18,
    704,
    1014,
    38,
    classic || dualBorder ? "#ffffff" : trainer ? "#f5cd30" : "#20252b",
    dualBorder ? "#753bbd" : classic ? "#000000" : undefined,
    dualBorder ? 8 : 2,
  );
  if (dualBorder) {
    box(32, 32, 676, 986, 24, "#ffffff", "#f5cd30", 8);
  } else if (classic) {
    const outlinedCircle = (x: number, y: number, radius: number) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };
    outlinedCircle(67, 68, 23);
    outlinedCircle(67, 68, 17);
    [0, 1, 2].forEach((i) => outlinedCircle(112 + i * 24, 60, 6));
    box(36, 110, 668, 864, 24, "#ffffff", "#000000");
  } else if (trainer) {
    box(34, 34, 672, 982, 25, "#fffdf2", "#272727");
    box(52, 52, 636, 126, 16, "#f5cd30");
    // Poké Ball silhouette, kept away from the QR quiet zone.
    circle(370, 865, 42, "#252525");
    circle(370, 865, 35, "#ffffff");
    ctx.fillStyle = "#252525";
    ctx.fillRect(334, 860, 72, 10);
    circle(370, 865, 15, "#252525");
    circle(370, 865, 9, "#ffffff");
  } else {
    box(38, 38, 664, 974, 24, "#20252b", "#f5cd30");
    box(58, 192, 624, 646, 18, "#ffffff");
    for (let i = 0; i < 6; i++)
      box(272 + i * 35, 839, 22, 5, 2, i < 3 ? "#f5cd30" : "#626870");
  }
  const light = model === "research";
  text(
    item.kind.toLocaleUpperCase("pt-BR"),
    classic ? 150 : 109,
    18,
    light ? "#f5cd30" : "#252525",
    700,
  );
  text(
    item.title,
    dualBorder ? 220 : classic ? 254 : trainer ? 267 : 266,
    37,
    "#20252b",
    700,
    560,
    2,
  );
  // Generate the same raw qrId already used by the participant scanner.
  const qr = await QRCode.toCanvas(item.value, {
    width: 900,
    margin: 4,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });
  const qrSize = dualBorder ? 585 : 408;
  const qrX = (740 - qrSize) / 2;
  const qrY = 561 - qrSize / 2;
  box(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 16, "#ffffff");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);
  text(
    "ESCANEIE NA POKÉDEX",
    dualBorder ? 884 : 810,
    13,
    light ? "#20252b" : "#525252",
    600,
  );
  text(eventName, 931, 24, light ? "#ffffff" : "#20252b", 700, 570);
  text(
    "POKÉDEX · EXPLORE. CONECTE. DESCUBRA.",
    classic ? 1001 : 982,
    10,
    light ? "#f5cd30" : classic ? "#000000" : "#525252",
    600,
  );
  return canvas;
}

export async function downloadQrPdf(
  items: PrintableQr[],
  model: QrPrintModel,
  eventName: string,
) {
  if (!items.length) throw new Error("Selecione pelo menos um QR code.");
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [148, 210],
    compress: true,
  });
  for (let index = 0; index < items.length; index++) {
    const canvas = await renderQrPrint(items[index], model, eventName);
    if (index) pdf.addPage([148, 210], "portrait");
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      148,
      210,
      undefined,
      "FAST",
    );
    canvas.width = 0;
    canvas.height = 0;
  }
  pdf.save(`qr-codes-${model}-a5.pdf`);
}

export const QR_PRINT_MARGIN_MM = 15;

/** Fit A5-proportioned plates inside the 15 mm margins of A4 landscape. */
export function buildQrPrintSheets(items: PrintableQr[]) {
  const sheets: {
    plates: {
      item: PrintableQr;
      x: number;
      y: number;
      width: number;
      height: number;
    }[];
    dividerX: number | null;
  }[] = [];
  const height = 210 - 2 * QR_PRINT_MARGIN_MM;
  const width = height * (148 / 210);
  const gap = 297 - 2 * QR_PRINT_MARGIN_MM - 2 * width;
  for (let index = 0; index < items.length; index += 2) {
    const pair = items.slice(index, index + 2);
    const groupWidth = pair.length * width + (pair.length - 1) * gap;
    const startX = (297 - groupWidth) / 2;
    sheets.push({
      plates: pair.map((item, slot) => ({
        item,
        x: startX + slot * (width + gap),
        y: QR_PRINT_MARGIN_MM,
        width,
        height,
      })),
      dividerX: pair.length === 2 ? 297 / 2 : null,
    });
  }
  return sheets;
}

export async function downloadQrA4Pdf(items: PrintableQr[], eventName: string) {
  if (!items.length) throw new Error("Selecione pelo menos um QR code.");
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const sheets = buildQrPrintSheets(items);
  for (const [index, sheet] of sheets.entries()) {
    if (index) pdf.addPage("a4", "landscape");
    for (const plate of sheet.plates) {
      const canvas = await renderQrPrint(plate.item, "dual-border", eventName);
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        plate.x,
        plate.y,
        plate.width,
        plate.height,
        undefined,
        "FAST",
      );
      canvas.width = 0;
      canvas.height = 0;
    }
    if (sheet.dividerX !== null) {
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.15);
      pdf.line(
        sheet.dividerX,
        QR_PRINT_MARGIN_MM,
        sheet.dividerX,
        210 - QR_PRINT_MARGIN_MM,
      );
    }
  }
  pdf.save("qr-codes-a4-horizontal.pdf");
}
