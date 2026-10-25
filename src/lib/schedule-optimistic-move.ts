import { ScheduleEntry, getScheduleTrackOrder } from "@/contracts/schedule";
import { ScheduleMoveInput } from "@/contracts/schedule-move";

/** Preview the destination while the server validates and saves the move. */
export function previewScheduleMove(
  schedule: ScheduleEntry[],
  input: ScheduleMoveInput,
): ScheduleEntry[] {
  const source = schedule.find((item) => item.id === input.id);
  if (!source) return schedule;
  // The event uses São Paulo time (UTC-3), matching the server's intervals.
  const eventDate = new Date(source.startAt.getTime() - 3 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return schedule
    .map((item) => {
      if (item.id === source.id) {
        return {
          ...item,
          startAt: new Date(`${eventDate}T${input.startTime}:00-03:00`),
          endAt: new Date(`${eventDate}T${input.endTime}:00-03:00`),
          track: input.track,
          order: input.track ? getScheduleTrackOrder(input.track) : null,
        };
      }
      if (item.id === input.targetId) {
        return {
          ...item,
          startAt: source.startAt,
          endAt: source.endAt,
          track: source.track,
          order: source.order,
        };
      }
      return item;
    })
    .sort(
      (a, b) =>
        a.startAt.getTime() - b.startAt.getTime() ||
        (a.order ?? -1) - (b.order ?? -1),
    );
}
