import { z } from "zod";

export const scheduleActivitySchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("talk"),
      talkId: z.string().trim().min(1).max(128),
    })
    .strict(),
  z
    .object({
      type: z.enum(["opening", "break", "closing"]),
      title: z.string().trim().min(2).max(120),
    })
    .strict(),
]);

const scheduleWritableSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    date: z.iso.date(),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    room: z.string().trim().min(1).max(80).nullable(),
    activity: scheduleActivitySchema,
    active: z.boolean(),
    order: z.number().int().nonnegative(),
  })
  .strict()
  .refine((value) => value.endAt > value.startAt, {
    path: ["endAt"],
    message: "O término deve ser posterior ao início.",
  });

export const scheduleInputSchema = scheduleWritableSchema;
export const scheduleFieldsSchema = scheduleWritableSchema.and(
  z
    .object({
      eventId: z.string().trim().min(1).max(128),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .strict(),
);
export type ScheduleEntry = z.infer<typeof scheduleFieldsSchema>;
export type ScheduleInput = z.infer<typeof scheduleInputSchema>;
