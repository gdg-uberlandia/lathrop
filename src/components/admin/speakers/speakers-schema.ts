import { z } from "zod";
import { SpeakerTech } from "@/models/speaker";

export const speakerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Nome obrigatório"),
  content: z.string().min(2, "Conteúdo obrigatório"),
  topic: z.string().min(2, "Tópico obrigatório"),
  company: z.string().optional(),
  miniBio: z.string().optional(),
  photo: z.string().url("URL da foto inválida").optional(),
  socialMedia: z
    .object({
      github: z.string().optional(),
      instagram: z.string().optional(),
      linkedIn: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  tech: z.string().optional(),
  title: z.string().optional(),
  canBeEvaluated: z.boolean().optional(),
});

export type SpeakerFormType = z.infer<typeof speakerSchema>;
