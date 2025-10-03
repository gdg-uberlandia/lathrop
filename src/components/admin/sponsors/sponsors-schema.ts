import { z } from "zod";

export const sponsorFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  url: z.string().url("URL inválida"),
  logo: z.string().url("URL da logo inválida").optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  level: z.string().optional(),
});
export type SponsorFormType = z.infer<typeof sponsorFormSchema>;
