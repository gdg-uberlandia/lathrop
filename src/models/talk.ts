import { z } from "zod";

export const talkFormatSchema = z.enum(["talk", "panel", "keynote"]);
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
        message: "Talk speaker identifiers must be unique",
      }),
    evaluationStatus: talkEvaluationStatusSchema,
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const talkInputSchema = talkFieldsSchema.omit({
  eventId: true,
  createdAt: true,
  updatedAt: true,
});

export type Talk = z.infer<typeof talkFieldsSchema>;
export type TalkInput = z.infer<typeof talkInputSchema>;
export type TalkEvaluationStatus = z.infer<typeof talkEvaluationStatusSchema>;
export type TalkFormat = z.infer<typeof talkFormatSchema>;
export type PublicTalk = Omit<Talk, "createdAt" | "updatedAt">;

export function toPublicTalk({
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...talk
}: Talk): PublicTalk {
  return talk;
}
