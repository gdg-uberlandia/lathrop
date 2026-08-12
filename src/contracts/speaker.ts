import { z } from "zod";
import { urlSchema } from "./url";

const optionalTextSchema = (maximum: number) =>
  z.string().trim().min(1).max(maximum).nullable();

export const speakerSocialMediaSchema = z
  .object({
    instagram: urlSchema().nullable(),
    linkedIn: urlSchema().nullable(),
  })
  .strict();

export const speakerFieldsSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    eventId: z.string().trim().min(1).max(128),
    name: z.string().trim().min(2).max(120),
    company: optionalTextSchema(120),
    title: optionalTextSchema(120),
    miniBio: optionalTextSchema(3_000),
    photoUrl: urlSchema().nullable(),
    socialMedia: speakerSocialMediaSchema,
    isVisible: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

const speakerWritableFieldsSchema = speakerFieldsSchema.omit({
  eventId: true,
  createdAt: true,
  updatedAt: true,
});

export const speakerCreateSchema = speakerWritableFieldsSchema;
export const speakerUpdateSchema = speakerWritableFieldsSchema;

// Transitional alias for forms that use the same payload for create and update.
export const speakerInputSchema = speakerCreateSchema;

export type Speaker = z.infer<typeof speakerFieldsSchema>;
export type SpeakerCreate = z.infer<typeof speakerCreateSchema>;
export type SpeakerUpdate = z.infer<typeof speakerUpdateSchema>;
export type SpeakerInput = SpeakerCreate;
export type PublicSpeaker = Omit<Speaker, "createdAt" | "updatedAt">;
export type PublicSpeakerSummary = Pick<
  PublicSpeaker,
  "id" | "name" | "company" | "title" | "photoUrl"
>;

export function toPublicSpeaker({
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...speaker
}: Speaker): PublicSpeaker {
  return speaker;
}
