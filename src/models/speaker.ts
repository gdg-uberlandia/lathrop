import { z } from "zod";

const optionalTextSchema = (maximum: number) =>
  z.string().trim().min(1).max(maximum).nullable();

export const speakerSocialMediaSchema = z
  .object({
    instagram: z.url().nullable(),
    linkedIn: z.url().nullable(),
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
    photoUrl: z.url().nullable(),
    socialMedia: speakerSocialMediaSchema,
    isVisible: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const speakerInputSchema = speakerFieldsSchema.omit({
  eventId: true,
  createdAt: true,
  updatedAt: true,
});

export type Speaker = z.infer<typeof speakerFieldsSchema>;
export type SpeakerInput = z.infer<typeof speakerInputSchema>;
export type PublicSpeaker = Omit<Speaker, "createdAt" | "updatedAt">;

export function toPublicSpeaker({
  createdAt: _createdAt,
  updatedAt: _updatedAt,
  ...speaker
}: Speaker): PublicSpeaker {
  return speaker;
}

/** Compatibility type used only by archived event components. */
export type LegacySpeaker = Speaker & {
  content?: string;
  photo?: string;
  tech?: string;
  topic?: string;
};

export enum SpeakerTech {
  Career = "Carreira",
  Infra_Devops = "Infra/Devops",
  MachineLearning = "Machine Learning",
  UI_UX = "UI/UX",
  Web = "Web",
}
