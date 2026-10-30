import { z } from "zod";
import {
  ScheduleEntry,
  scheduleTimeSchema,
  scheduleTrackSchema,
  scheduleInputSchema,
} from "./schedule";

export const scheduleMoveSchema = z
  .object({
    id: z.string().min(1).max(128),
    targetId: z.string().min(1).max(128).optional(),
    startTime: scheduleTimeSchema,
    endTime: scheduleTimeSchema,
    track: scheduleTrackSchema.nullable(),
    expectedUpdatedAt: z.string().datetime(),
    targetUpdatedAt: z.string().datetime().optional(),
  })
  .strict();
export type ScheduleMoveInput = z.infer<typeof scheduleMoveSchema>;
const time = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(date);

export function planScheduleMove(
  schedule: ScheduleEntry[],
  input: ScheduleMoveInput,
) {
  const source = schedule.find((item) => item.id === input.id);
  const target = input.targetId
    ? schedule.find((item) => item.id === input.targetId)
    : undefined;
  if (!source || (input.targetId && !target))
    throw new Error("Item da programação não encontrado. Atualize a página.");
  if (
    source.updatedAt.toISOString() !== input.expectedUpdatedAt ||
    (target && target.updatedAt.toISOString() !== input.targetUpdatedAt)
  )
    throw new Error(
      "A programação foi alterada por outra pessoa. Atualize a página antes de mover.",
    );
  if (source.id === target?.id) return [];
  if ((source.track === null) !== (input.track === null))
    throw new Error(
      "Atividades gerais só podem ocupar espaços gerais; palestras precisam de uma trilha.",
    );
  if (
    target &&
    (time(target.startAt) !== input.startTime ||
      time(target.endAt) !== input.endTime ||
      target.track !== input.track)
  )
    throw new Error("O destino foi alterado. Atualize a programação.");
  const move = (
    item: ScheduleEntry,
    startTime: string,
    endTime: string,
    track: ScheduleEntry["track"],
  ) =>
    scheduleInputSchema.parse({
      id: item.id,
      startTime,
      endTime,
      track,
      activity: item.activity,
      active: item.active,
    });
  return [
    move(source, input.startTime, input.endTime, input.track),
    ...(target
      ? [move(target, time(source.startAt), time(source.endAt), source.track)]
      : []),
  ];
}
