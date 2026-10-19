import assert from "node:assert/strict";
import { it } from "node:test";
import { SCHEDULE_TRACKS } from "../contracts/schedule";
import {
  SCHEDULE_TRACK_STYLES,
  sortScheduleTracks,
} from "./schedule-presentation";

it("ordena as sete trilhas independentemente da ordem recebida", () => {
  const entries = SCHEDULE_TRACKS.map(({ value }) => ({
    track: value,
  })).reverse();
  const original = [...entries];
  assert.deepEqual(
    sortScheduleTracks(entries).map(({ track }) => track),
    SCHEDULE_TRACKS.map(({ value }) => value),
  );
  assert.deepEqual(entries, original);
});

it("mantém a ordem de trilhas ausentes e uma cor distinta por trilha", () => {
  assert.deepEqual(
    sortScheduleTracks([
      { track: "LOUNGE_SENIOR" },
      { track: "COMUNIDADE_2" },
      { track: "MINAS" },
    ]).map(({ track }) => track),
    ["MINAS", "COMUNIDADE_2", "LOUNGE_SENIOR"],
  );
  assert.equal(
    new Set(Object.values(SCHEDULE_TRACK_STYLES).map(({ badge }) => badge))
      .size,
    7,
  );
});
