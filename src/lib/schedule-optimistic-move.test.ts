import assert from "node:assert/strict";
import { it } from "node:test";
import { ScheduleEntry } from "@/contracts/schedule";
import { ScheduleMoveInput } from "@/contracts/schedule-move";
import { previewScheduleMove } from "./schedule-optimistic-move";

const date = (time: string) => new Date(`2026-11-01T${time}:00-03:00`);
const entry = (
  id: string,
  start: string,
  end: string,
  track: ScheduleEntry["track"],
  order: number,
): ScheduleEntry => ({
  id,
  startAt: date(start),
  endAt: date(end),
  track,
  order,
  eventId: "event",
  activity: { type: "talk", talkId: id },
  active: true,
  createdAt: date("08:00"),
  updatedAt: date("08:00"),
});
const source = entry("source", "09:00", "10:00", "MINAS", 0);
const target = entry("target", "11:00", "11:30", "CURADO", 1);
const request: ScheduleMoveInput = {
  id: source.id,
  startTime: "11:00",
  endTime: "11:30",
  track: "CURADO",
  expectedUpdatedAt: source.updatedAt.toISOString(),
};
it("previews a move into a vacant slot without mutating the rollback snapshot", () => {
  const previous = [source];
  const result = previewScheduleMove(previous, request);
  assert.equal(result[0].startAt.getTime(), date("11:00").getTime());
  assert.equal(result[0].endAt.getTime(), date("11:30").getTime());
  assert.equal(result[0].track, "CURADO");
  assert.equal(result[0].order, 1);
  assert.equal(previous[0].startAt.getTime(), date("09:00").getTime());
  assert.equal(previous[0].track, "MINAS");
  assert.deepEqual(result[0].activity, previous[0].activity);
  assert.equal(result[0].updatedAt, previous[0].updatedAt);
});
it("previews both sides of a swap atomically and preserves other entries", () => {
  const other = entry("other", "13:00", "14:00", "CANASTRA", 2);
  const previous = [source, target, other];
  const result = previewScheduleMove(previous, {
    ...request,
    targetId: target.id,
  });
  assert.deepEqual(
    result.map((item) => [
      item.id,
      item.startAt.getTime(),
      item.endAt.getTime(),
      item.track,
      item.order,
    ]),
    [
      [target.id, source.startAt.getTime(), source.endAt.getTime(), "MINAS", 0],
      [
        source.id,
        target.startAt.getTime(),
        target.endAt.getTime(),
        "CURADO",
        1,
      ],
      [other.id, other.startAt.getTime(), other.endAt.getTime(), "CANASTRA", 2],
    ],
  );
  assert.equal(result[2], other);
  assert.equal(previous[0], source);
  assert.equal(previous[1], target);
  assert.equal(target.track, "CURADO");
});
it("leaves the cache untouched if the source no longer exists", () => {
  const previous = [target];
  assert.equal(previewScheduleMove(previous, request), previous);
});
