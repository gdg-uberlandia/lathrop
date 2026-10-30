import assert from "node:assert/strict";
import { it } from "node:test";
import { ScheduleEntry } from "./schedule";
import {
  planScheduleMove,
  ScheduleMoveInput,
  scheduleMoveSchema,
} from "./schedule-move";

const date = (time: string) => new Date(`2026-11-01T${time}:00-03:00`);
const entry = (
  id: string,
  start: string,
  end: string,
  track: ScheduleEntry["track"] = "MINAS",
): ScheduleEntry => ({
  id,
  startAt: date(start),
  endAt: date(end),
  track,
  order: 0,
  eventId: "event",
  activity: track
    ? { type: "talk", talkId: id }
    : { type: "break", title: "Intervalo" },
  active: true,
  createdAt: date("08:00"),
  updatedAt: date("08:00"),
});
const source = entry("source", "09:00", "10:00");
const destination = entry("destination", "11:00", "11:30", "CURADO");
const request: ScheduleMoveInput = {
  id: source.id,
  startTime: "11:00",
  endTime: "11:30",
  track: "CURADO",
  expectedUpdatedAt: source.updatedAt.toISOString(),
};

it("moves to a vacant slot using its interval and track, preserving the activity", () => {
  const result = planScheduleMove([source], request);
  assert.equal(result.length, 1);
  assert.equal(result[0].startTime, "11:00");
  assert.equal(result[0].endTime, "11:30");
  assert.equal(result[0].track, "CURADO");
  assert.deepEqual(result[0].activity, source.activity);
  assert.equal(source.startAt.getTime(), date("09:00").getTime());
});
it("swaps both intervals and tracks, including different durations", () => {
  const result = planScheduleMove([source, destination], {
    ...request,
    targetId: destination.id,
    targetUpdatedAt: destination.updatedAt.toISOString(),
  });
  assert.deepEqual(
    result.map((item) => [item.id, item.startTime, item.endTime, item.track]),
    [
      ["source", "11:00", "11:30", "CURADO"],
      ["destination", "09:00", "10:00", "MINAS"],
    ],
  );
});
it("rejects stale source and target rather than overwriting another edit", () => {
  assert.throws(
    () =>
      planScheduleMove([source], {
        ...request,
        expectedUpdatedAt: date("08:10").toISOString(),
      }),
    /outra pessoa/,
  );
  assert.throws(
    () =>
      planScheduleMove([source, destination], {
        ...request,
        targetId: destination.id,
        targetUpdatedAt: date("08:10").toISOString(),
      }),
    /outra pessoa/,
  );
});
it("rejects general activities dropped into a track and talks into general slots", () => {
  assert.throws(
    () => planScheduleMove([source], { ...request, track: null }),
    /Atividades gerais/,
  );
  const general = entry("general", "09:00", "10:00", null);
  assert.throws(
    () => planScheduleMove([general], { ...request, id: general.id }),
    /Atividades gerais/,
  );
});
it("rejects an outdated destination, missing items, and invalid intervals", () => {
  assert.throws(
    () =>
      planScheduleMove([source, destination], {
        ...request,
        targetId: destination.id,
        targetUpdatedAt: destination.updatedAt.toISOString(),
        startTime: "12:00",
      }),
    /destino foi alterado/,
  );
  assert.throws(() => planScheduleMove([], request), /não encontrado/);
  assert.throws(() =>
    planScheduleMove([source], { ...request, endTime: "10:00" }),
  );
  assert.equal(
    scheduleMoveSchema.safeParse({ ...request, startTime: "11:05" }).success,
    false,
  );
});
it("allows swapping general activities with each other", () => {
  const a = entry("a", "09:00", "10:00", null);
  const b = entry("b", "11:00", "11:30", null);
  assert.equal(
    planScheduleMove([a, b], {
      ...request,
      id: a.id,
      track: null,
      targetId: b.id,
      targetUpdatedAt: b.updatedAt.toISOString(),
    }).length,
    2,
  );
});
