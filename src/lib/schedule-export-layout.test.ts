import { formatScheduleDescription } from "./schedule-description";
import assert from "node:assert/strict";
import { it } from "node:test";
import { SCHEDULE_TRACKS } from "../contracts/schedule";
import {
  buildScheduleExportPages,
  EXPORT_HEIGHT,
  EXPORT_WIDTH,
  wrapExportText,
  type ScheduleExportRow,
} from "./schedule-export-layout";

const row = (
  overrides: Partial<ScheduleExportRow> = {},
): ScheduleExportRow => ({
  time: "09:00–10:00",
  startAt: "2026-10-19T12:00:00.000Z",
  endAt: "2026-10-19T13:00:00.000Z",
  trackId: "MINAS",
  track: "Minas",
  type: "Palestra",
  title: "Tecnologia e comunidade",
  description: "Uma descrição completa.",
  speakers: "Pessoa Palestrante",
  ...overrides,
});
const measure = (text: string) => Array.from(text).length * 11;

it("agrupa por horário e ordena as sete trilhas, preservando blocos parciais", () => {
  const rows = SCHEDULE_TRACKS.map((track) =>
    row({ trackId: track.value, track: track.label }),
  ).reverse();
  const cards = buildScheduleExportPages(rows, measure).flatMap(
    (page) => page.cards,
  );
  assert.deepEqual(
    cards.map((card) => card.row.trackId),
    SCHEDULE_TRACKS.map((track) => track.value),
  );
  assert.equal(new Set(cards.map((card) => card.y)).size, 1);
  assert.equal(cards.length, 7);
  assert.equal(EXPORT_WIDTH / EXPORT_HEIGHT, 297 / 210);
  assert.deepEqual(
    buildScheduleExportPages([rows[0]], measure)[0].cards.map(
      (card) => card.row.trackId,
    ),
    ["LOUNGE_SENIOR"],
  );
});

it("atividades gerais ocupam toda a largura e mantêm seus títulos", () => {
  const pages = buildScheduleExportPages(
    [
      row({
        trackId: null,
        track: "Geral",
        type: "Intervalo",
        title: "Coffee break",
      }),
    ],
    measure,
  );
  assert.equal(pages[0].cards[0].width, EXPORT_WIDTH - 112);
  assert.equal(pages[0].cards[0].lines[0].text, "Coffee break");
});

it("mantém colunas de trilhas vazias nos blocos parciais", () => {
  const complete = buildScheduleExportPages(
    SCHEDULE_TRACKS.map((track) => row({ trackId: track.value })),
    measure,
  )[0].cards;
  const partial = buildScheduleExportPages(
    [row({ trackId: "MINAS" }), row({ trackId: "LOUNGE_SENIOR" })],
    measure,
  )[0].cards;
  assert.equal(partial[0].x, complete[0].x);
  assert.equal(partial[1].x, complete[6].x);
  assert.equal(partial[0].y, partial[1].y);
});

it("inclui descrições limitadas a 450 caracteres nas exportações", () => {
  const description = "Descrição completa da atividade. ".repeat(30);
  const pages = buildScheduleExportPages([row({ description })], measure);
  const body = pages
    .flatMap((page) => page.cards)
    .flatMap((card) => card.lines)
    .filter((line) => line.kind === "body")
    .map((line) => line.text)
    .join(" ");
  assert.equal(
    body.replace(/\s/g, ""),
    formatScheduleDescription(description).replace(/\s/g, ""),
  );
  assert.ok(body.endsWith("…"));
});

it("mantém textos de até 450 caracteres e conta emojis sem cortá-los ao meio", () => {
  assert.equal(formatScheduleDescription("a".repeat(450)), "a".repeat(450));
  assert.equal(
    formatScheduleDescription("a".repeat(451)),
    "a".repeat(449) + "…",
  );
  assert.equal(
    formatScheduleDescription("😀".repeat(451)),
    "😀".repeat(449) + "…",
  );
  assert.equal(formatScheduleDescription(undefined), "");
  assert.equal(formatScheduleDescription("  Texto curto.  "), "Texto curto.");
});

it("pagina textos longos sem cortar títulos ou palestrantes e preserva a coluna", () => {
  const speakers = "Pessoa Palestrante Convidada · ".repeat(150).trim();
  const pages = buildScheduleExportPages(
    [row({ speakers, trackId: "LOUNGE_SENIOR" })],
    measure,
  );
  assert.ok(pages.length > 1);
  const cards = pages.flatMap((page) => page.cards);
  assert.equal(cards.filter((card) => card.continued).length, cards.length - 1);
  const exported = cards
    .flatMap((card) => card.lines)
    .filter((line) => line.kind === "speakers")
    .map((line) => line.text)
    .join(" ");
  assert.equal(exported.replace(/\s+/g, " ").trim(), speakers);
  for (const card of cards) {
    assert.equal(card.x, cards[0].x);
    assert.ok(card.y + card.height <= EXPORT_HEIGHT - 58);
    assert.ok(card.x + card.width <= EXPORT_WIDTH - 56);
  }
});

it("quebra palavras extensas e respeita quebras de parágrafo", () => {
  assert.deepEqual(
    wrapExportText("ABCDEFGHIJ\nOlá mundo", 30, (text) => text.length * 10),
    ["ABC", "DEF", "GHI", "J", "Olá", "mun", "do"],
  );
});

it("separa horários iguais em dias diferentes e ordena cronologicamente", () => {
  const pages = buildScheduleExportPages(
    [
      row({
        startAt: "2026-10-20T12:00:00.000Z",
        endAt: "2026-10-20T13:00:00.000Z",
      }),
      row(),
    ],
    measure,
  );
  assert.deepEqual(
    pages.flatMap((page) => page.slots).map((slot) => slot.date),
    ["19 de outubro", "20 de outubro"],
  );
});
