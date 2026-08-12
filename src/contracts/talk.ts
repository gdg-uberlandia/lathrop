import { z } from "zod";

export const talkFormatSchema = z.enum(["talk", "panel", "keynote"]);

export function normalizeStoredTalkFormat(value: unknown) {
  return value === "opening_keynote" || value === "closing_keynote"
    ? "keynote"
    : value;
}

export const TALK_FORMAT_LABELS = {
  talk: "Palestra",
  panel: "Painel",
  keynote: "Keynote",
} as const satisfies Record<z.infer<typeof talkFormatSchema>, string>;
export const talkEvaluationStatusSchema = z.enum(["locked", "open", "closed"]);

export const talkFieldsSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    eventId: z.string().trim().min(1).max(128),
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().min(1).max(3_000),
    category: z.string().trim().min(1).max(120).nullable(),
    format: talkFormatSchema,
    speakerIds: z
      .array(z.string().trim().min(1).max(128))
      .min(1)
      .max(20)
      .refine((speakerIds) => new Set(speakerIds).size === speakerIds.length, {
        message: "Os identificadores dos palestrantes devem ser únicos",
      }),
    evaluationStatus: talkEvaluationStatusSchema,
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

const talkWritableFieldsSchema = talkFieldsSchema.omit({
  eventId: true,
  createdAt: true,
  updatedAt: true,
});

export const talkCreateSchema = talkWritableFieldsSchema;
export const talkUpdateSchema = talkWritableFieldsSchema;

// Transitional alias for forms that use the same payload for create and update.
export const talkInputSchema = talkCreateSchema;

export type Talk = z.infer<typeof talkFieldsSchema>;
export type TalkCreate = z.infer<typeof talkCreateSchema>;
export type TalkUpdate = z.infer<typeof talkUpdateSchema>;
export type TalkInput = TalkCreate;
export type TalkEvaluationStatus = z.infer<typeof talkEvaluationStatusSchema>;
export type TalkFormat = z.infer<typeof talkFormatSchema>;
export type PublicTalk = Omit<Talk, "createdAt" | "updatedAt">;
export type PublicTalkSummary = Pick<PublicTalk, "id" | "title" | "speakerIds">;

export function toPublicTalk({
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...talk
}: Talk): PublicTalk {
  return talk;
}
