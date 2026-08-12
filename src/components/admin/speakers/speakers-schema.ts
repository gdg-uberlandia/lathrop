import { z } from "zod";
import { optionalFormUrlSchema } from "@/contracts/url";

const optionalUrl = optionalFormUrlSchema();

export const speakerFormSchema = z.object({
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
});

export type SpeakerFormType = z.infer<typeof speakerFormSchema>;
