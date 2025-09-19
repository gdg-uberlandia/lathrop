import { z } from "zod";

export const sponsorsSchema = z.object({
  id: z.string().optional(),
  level: z.string().optional(),
  levelName: z.string().min(1, "Cota é obrigatório"),
  logo: z.string().min(1, "Logo é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  url: z.string().min(1, "URL é obrigatório"),
});

export type SponsorsrFormValues = z.infer<typeof sponsorsSchema>;
