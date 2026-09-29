import { z } from "zod";
import { optionalFormUrlSchema } from "@/contracts/url";

import {
  publicationInputToIso,
  validatePublicationTime,
} from "@/lib/speaker-publication-time";

const optionalUrl = optionalFormUrlSchema();

export const speakerFormSchema = z
  .object({
    id: z.string().trim().min(1, "Identificador obrigatório").max(128),
    name: z.string().trim().min(2, "Nome obrigatório").max(120),
    company: z.string().trim().max(120),
    title: z.string().trim().max(120),
    miniBio: z.string().trim().max(3_000),
    photoUrl: optionalUrl,
    socialMedia: z.object({
      instagram: optionalUrl,
      linkedIn: optionalUrl,
    }),
    isVisible: z.boolean(),
    publishAt: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.publishAt) return;
    try {
      const iso = publicationInputToIso(data.publishAt)!;
      const message = data.isVisible
        ? "Mantenha o palestrante oculto para agendar a publicação."
        : validatePublicationTime(iso);
      if (message)
        ctx.addIssue({ code: "custom", path: ["publishAt"], message });
    } catch {
      ctx.addIssue({
        code: "custom",
        path: ["publishAt"],
        message: "Data e hora inválidas.",
      });
    }
  });

export type SpeakerFormType = z.infer<typeof speakerFormSchema>;
