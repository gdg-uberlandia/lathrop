import { z } from "zod";

export const speakerSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  topic: z.string().min(1, "Tópico é obrigatório"),
  company: z.string().optional(),
  miniBio: z.string().optional(),
  photo: z.string().optional(),
  socialMedia: z.any().optional(),
  tech: z.any().optional(),
  title: z.string().optional(),
  key: z.string().optional(),
  id: z.string().optional(),
});

export type SpeakerFormValues = z.infer<typeof speakerSchema>;
