import { z } from "zod";
import { SpeechesPath } from "./schedule-types";

export const speechSchema = z.discriminatedUnion("topic", [
  z.object({
    id: z.string(),
    topic: z.enum([
      "registration",
      "start",
      "interval",
      "coffeeBreak",
      "finish",
    ]),
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    topic: z.enum(["keynote_start", "keynote_end"]),
    speakerSlugs: z.array(z.string()).length(1, "Selecione um palestrante."),
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    topic: z.literal("speech"),
    path: z.nativeEnum(SpeechesPath).optional(),
    speakerSlugs: z.array(z.string()).length(1, "Selecione um palestrante."),
    order: z.number(),
  }),
  z.object({
    id: z.string(),
    topic: z.literal("panel"),
    path: z.nativeEnum(SpeechesPath).optional(),
    speakerSlugs: z
      .array(z.string())
      .default([])
      .transform((arr) => arr.filter(Boolean))
      .refine((arr) => arr.length <= 3, "Máximo 3 palestrantes."),
    order: z.number(),
  }),
]);

export const scheduleSchema = z
  .object({
    id: z.string().optional(),
    start: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato de horário inválido")
      .refine((val) => {
        const [h, m] = val.split(":").map(Number);
        return h >= 8 && h <= 19 && m % 10 === 0;
      }, "Horário inicial deve ser entre 08:00 e 18:00 e minutos múltiplos de 10"),
    end: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato de horário inválido")
      .refine((val) => {
        const [h, m] = val.split(":").map(Number);
        return h >= 8 && h <= 19 && m % 10 === 0;
      }, "Horário final deve ser entre 08:00 e 18:00 e minutos múltiplos de 10"),
    speeches: z.array(speechSchema).min(1).max(5),
  })
  .refine(
    (data) => {
      const [startH, startM] = data.start.split(":").map(Number);
      const [endH, endM] = data.end.split(":").map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;
      return startTotal <= endTotal;
    },
    {
      message: "Horário inicial não pode ser maior que o final.",
      path: ["end"],
    },
  );

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
