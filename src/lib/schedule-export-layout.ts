import { formatScheduleDescription } from "./schedule-description";
import {
  getScheduleTrackOrder,
  SCHEDULE_TRACKS,
  type ScheduleTrack,
} from "@/contracts/schedule";

export type ScheduleExportRow = {
  time: string;
  startAt: string;
  endAt: string;
  trackId: ScheduleTrack | null;
  track: string;
  type: string;
  title: string;
  description: string;
  speakers: string;
};
export type ExportLine = { text: string; kind: "title" | "body" | "speakers" };
export type ExportCard = {
  row: ScheduleExportRow;
  lines: ExportLine[];
  x: number;
  y: number;
  width: number;
  height: number;
  continued: boolean;
};
export type ExportPage = {
  slots: { time: string; date: string; y: number }[];
  cards: ExportCard[];
};
// Eight pixels per millimetre, with the exact A4 landscape aspect ratio.
export const EXPORT_WIDTH = 297 * 8;
export const EXPORT_HEIGHT = 210 * 8;
export const EXPORT_FONTS = {
  title: "bold 23px Arial",
  body: "18px Arial",
  speakers: "18px Arial",
};
export const EXPORT_LINE_HEIGHT = 29;
const MARGIN = 56;
const GAP = 16;
const CONTENT_TOP = 172;
const CONTENT_BOTTOM = EXPORT_HEIGHT - 58;
const MAX_LINES = 23;

// Break long words too, preserving URLs and titles without truncation.
export function wrapExportText(
  text: string,
  width: number,
  measure: (text: string) => number,
): string[] {
  if (!text.trim()) return [];
  return text.split(/\r?\n/).flatMap((paragraph) => {
    const lines: string[] = [];
    let line = "";
    for (const word of paragraph.trim().split(/\s+/)) {
      if (!word) continue;
      if (line && measure(`${line} ${word}`) <= width) {
        line += ` ${word}`;
        continue;
      }
      if (line) {
        lines.push(line);
        line = "";
      }
      for (const char of word) {
        if (line && measure(line + char) > width) {
          lines.push(line);
          line = "";
        }
        line += char;
      }
    }
    lines.push(line);
    return lines;
  });
}

export function buildScheduleExportPages(
  rows: ScheduleExportRow[],
  measure: (text: string, kind: ExportLine["kind"]) => number,
): ExportPage[] {
  const pages: ExportPage[] = [];
  let page: ExportPage;
  let y = CONTENT_TOP;
  const newPage = () => {
    page = { slots: [], cards: [] };
    pages.push(page);
    y = CONTENT_TOP;
  };
  newPage();
  const slots = new Map<string, ScheduleExportRow[]>();
  const ordered = [...rows].sort(
    (a, b) =>
      a.startAt.localeCompare(b.startAt) ||
      a.endAt.localeCompare(b.endAt) ||
      (a.trackId === null ? -1 : getScheduleTrackOrder(a.trackId)) -
        (b.trackId === null ? -1 : getScheduleTrackOrder(b.trackId)),
  );
  for (const row of ordered) {
    const key = `${row.startAt}/${row.endAt}`;
    slots.set(key, [...(slots.get(key) ?? []), row]);
  }
  for (const items of slots.values()) {
    // General activities span the page; each track keeps its own fixed column.
    for (let index = 0; index < items.length; ) {
      const general = items[index].trackId === null;
      const batch = general
        ? [items[index++]]
        : items.slice(
            index,
            (index += Math.min(SCHEDULE_TRACKS.length, items.length - index)),
          );
      const width = general
        ? EXPORT_WIDTH - MARGIN * 2
        : (EXPORT_WIDTH - MARGIN * 2 - GAP * (SCHEDULE_TRACKS.length - 1)) /
          SCHEDULE_TRACKS.length;
      const cards = batch.map((row) => {
        const lines = (
          [
            [row.title, "title"],
            [formatScheduleDescription(row.description), "body"],
            [row.speakers, "speakers"],
          ] as const
        ).flatMap(([text, kind]) =>
          wrapExportText(text, width - 40, (value) => measure(value, kind)).map(
            (text) => ({ text, kind }),
          ),
        );
        const chunks: ExportLine[][] = [];
        for (let offset = 0; offset < lines.length; offset += MAX_LINES)
          chunks.push(lines.slice(offset, offset + MAX_LINES));
        return { row, chunks: chunks.length ? chunks : [[]] };
      });
      const fragments = Math.max(...cards.map(({ chunks }) => chunks.length));
      for (let fragment = 0; fragment < fragments; fragment++) {
        const height = Math.max(
          ...cards.map(
            ({ chunks }) =>
              (chunks[fragment]?.length ?? 0) * EXPORT_LINE_HEIGHT + 104,
          ),
        );
        if (y + height + 46 > CONTENT_BOTTOM && page!.cards.length) newPage();
        page!.slots.push({
          time: batch[0].time,
          date: new Intl.DateTimeFormat("pt-BR", {
            day: "numeric",
            month: "long",
            timeZone: "America/Sao_Paulo",
          }).format(new Date(batch[0].startAt)),
          y,
        });
        y += 46;
        cards.forEach(({ row, chunks }) => {
          const column =
            row.trackId === null ? 0 : getScheduleTrackOrder(row.trackId);
          if (!chunks[fragment]) return;
          page!.cards.push({
            row,
            lines: chunks[fragment],
            x: MARGIN + column * (width + GAP),
            y,
            width,
            height,
            continued: fragment > 0,
          });
        });
        y += height + 32;
      }
    }
  }
  return pages;
}
