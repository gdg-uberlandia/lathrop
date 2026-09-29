import { z } from "zod";
import { speakerCreateSchema, type Speaker } from "./speaker";
import { validatePublicationTime } from "../lib/speaker-publication-time";

// Administrative metadata only. It is never persisted in the shared speaker document.
export const adminSpeakerInputSchema = speakerCreateSchema
  .extend({
    publishAt: z.string().datetime().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.publishAt) return;
    const message = data.isVisible
      ? "Mantenha o palestrante oculto para agendar a publicação."
      : validatePublicationTime(data.publishAt);
    if (message) ctx.addIssue({ code: "custom", path: ["publishAt"], message });
  });

export type AdminSpeakerInput = z.infer<typeof adminSpeakerInputSchema>;
export type AdminSpeaker = Speaker & { publishAt: string | null };
