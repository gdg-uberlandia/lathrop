import { z } from "zod";
import { optionalFormUrlSchema, urlSchema } from "@/contracts/url";

export const sponsorFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  url: urlSchema(),
  logo: optionalFormUrlSchema("URL da logo inválida").optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  level: z.string().optional(),
});
export type SponsorFormType = z.infer<typeof sponsorFormSchema>;
