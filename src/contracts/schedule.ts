import { z } from "zod";

export const scheduleTrackSchema = z.enum([
  "MINAS",
  "CURADO",
  "CANASTRA",
  "TRANCA",
  "COMUNIDADE",
]);

export const SCHEDULE_TRACKS = [
  { value: "MINAS", label: "Minas", order: 0 },
  { value: "CURADO", label: "Curado", order: 1 },
  { value: "CANASTRA", label: "Canastra", order: 2 },
  { value: "TRANCA", label: "Trança", order: 3 },
  { value: "COMUNIDADE", label: "Comunidade", order: 4 },
] as const;

export const scheduleActivitySchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.enum(["talk", "opening", "closing"]),
      talkId: z.string().trim().min(1).max(128),
    })
    .strict(),
  z
    .object({
      type: z.literal("break"),
      title: z.string().trim().min(2).max(120),
    })
    .strict(),
]);

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Informe um horário válido.")
  .refine(
    (value) => Number(value.slice(3, 5)) % 15 === 0,
    "Use intervalos de 15 minutos.",
  );

export const scheduleInputSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    startTime: timeSchema,
    endTime: timeSchema,
    track: scheduleTrackSchema.nullable(),
    activity: scheduleActivitySchema,
    active: z.boolean(),
  })
  .strict()
  .refine((value) => value.endTime > value.startTime, {
    path: ["endTime"],
    message: "O término deve ser posterior ao início.",
  })
  .superRefine((value, context) => {
    if (value.activity.type === "talk" && !value.track) {
      context.addIssue({
        code: "custom",
        path: ["track"],
        message: "Selecione a trilha da palestra.",
      });
    }
    if (value.activity.type !== "talk" && value.track) {
      context.addIssue({
        code: "custom",
        path: ["track"],
        message: "Atividades gerais não possuem trilha.",
      });
    }
  });

export const scheduleFieldsSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    eventId: z.string().trim().min(1).max(128),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    track: scheduleTrackSchema.nullable(),
    order: z
      .number()
      .int()
      .min(0)
      .max(SCHEDULE_TRACKS.length - 1)
      .nullable(),
    activity: scheduleActivitySchema,
    active: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict()
  .refine((value) => value.endAt > value.startAt, {
    path: ["endAt"],
    message: "O término deve ser posterior ao início.",
  });

export type ScheduleEntry = z.infer<typeof scheduleFieldsSchema>;
export type ScheduleInput = z.infer<typeof scheduleInputSchema>;
export type ScheduleTrack = z.infer<typeof scheduleTrackSchema>;

export function getScheduleTrackOrder(track: ScheduleTrack) {
  return SCHEDULE_TRACKS.find((item) => item.value === track)!.order;
}
