import assert from "node:assert/strict";
import { test as runTest } from "node:test";
import { buildQrPrintSheets, QR_SAMPLE, fitQrPrintText } from "./qr-print";

const measure = (value: string, size: number) =>
  Array.from(value).length * size * 0.6;

test("título longo usa duas linhas e respeita a largura sem cortar palavras", () => {
  const title = "Explore os desafios da Pokédex e encontre novas conexões";
  const fitted = fitQrPrintText(title, 37, 560, 2, measure);
  assert.equal(fitted.lines.length, 2);
  assert.equal(fitted.lines.join(" "), title);
  assert.ok(fitted.lines.every((line) => measure(line, fitted.size) <= 560));
});

test("título com 120 caracteres cabe em até duas linhas sem perder conteúdo", () => {
  const title = "Descubra novas conexões e complete os desafios da comunidade "
    .repeat(3)
    .slice(0, 120)
    .trim();
  const fitted = fitQrPrintText(title, 37, 560, 2, measure);
  assert.ok(fitted.lines.length <= 2);
  assert.equal(fitted.lines.join(" "), title);
  assert.ok(fitted.lines.every((line) => measure(line, fitted.size) <= 560));
});

test("palavra extensa não ultrapassa a margem nem perde caracteres", () => {
  const title = "A".repeat(120);
  const fitted = fitQrPrintText(title, 37, 560, 2, measure);
  assert.ok(fitted.lines.length <= 2);
  assert.equal(fitted.lines.join(""), title);
  assert.ok(fitted.lines.every((line) => measure(line, fitted.size) <= 560));
});

test("centraliza duas placas proporcionais e respeita margens de 15 mm", () => {
  const items = Array.from({ length: 4 }, (_, index) => ({
    ...QR_SAMPLE,
    key: String(index),
  }));
  const sheets = buildQrPrintSheets(items);
  assert.equal(sheets.length, 2);
  assert.deepEqual(
    sheets.flatMap((s) => s.plates.map((p) => p.item.key)),
    ["0", "1", "2", "3"],
  );
  for (const sheet of sheets) {
    assert.equal(sheet.plates.length, 2);
    assert.equal(sheet.plates[0].x, 15);
    assert.ok(Math.abs(sheet.plates[1].x + sheet.plates[1].width - 282) < 1e-9);
    assert.equal(sheet.dividerX, 148.5);
    for (const plate of sheet.plates) {
      assert.equal(plate.y, 15);
      assert.equal(plate.height, 180);
      assert.ok(Math.abs(plate.width / plate.height - 148 / 210) < 1e-9);
      assert.ok(plate.x >= 15 && plate.x + plate.width <= 282);
      assert.equal(210 - plate.y - plate.height, 15);
    }
  }
});

test("última placa ímpar fica centralizada sozinha sem divisor", () => {
  const sheets = buildQrPrintSheets([QR_SAMPLE, QR_SAMPLE, QR_SAMPLE]);
  assert.equal(sheets.length, 2);
  assert.equal(sheets[1].plates.length, 1);
  assert.equal(sheets[1].plates[0].x + sheets[1].plates[0].width / 2, 148.5);
  assert.equal(sheets[1].plates[0].y, 15);
  assert.equal(sheets[1].dividerX, null);
  assert.deepEqual(buildQrPrintSheets([]), []);
});

function test(name: string, run: () => void) {
  runTest(name, () => {
    const previous = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://pokedex.example.com";
    try {
      run();
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
      else process.env.NEXT_PUBLIC_APP_URL = previous;
    }
  });
}
