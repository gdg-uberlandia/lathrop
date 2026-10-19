import {
  getScheduleTrackOrder,
  type ScheduleTrack,
} from "@/contracts/schedule";

export const SCHEDULE_TRACK_STYLES = {
  MINAS: {
    card: "!border-amber-400/50",
    badge: "bg-amber-400/15 !text-amber-300",
  },
  CURADO: { card: "!border-red-400/50", badge: "bg-red-400/15 !text-red-300" },
  CANASTRA: {
    card: "!border-pink-400/50",
    badge: "bg-pink-400/15 !text-pink-300",
  },
  TRANCA: {
    card: "!border-blue-400/50",
    badge: "bg-blue-400/15 !text-blue-300",
  },
  COMUNIDADE: {
    card: "!border-emerald-400/50",
    badge: "bg-emerald-400/15 !text-emerald-300",
  },
  COMUNIDADE_2: {
    card: "!border-teal-400/50",
    badge: "bg-teal-400/15 !text-teal-300",
  },
  LOUNGE_SENIOR: {
    card: "!border-violet-400/50",
    badge: "bg-violet-400/15 !text-violet-300",
  },
} satisfies Record<ScheduleTrack, { card: string; badge: string }>;

export function sortScheduleTracks<T extends { track: ScheduleTrack | null }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) =>
      (a.track === null ? -1 : getScheduleTrackOrder(a.track)) -
      (b.track === null ? -1 : getScheduleTrackOrder(b.track)),
  );
}
