import { z } from "zod";

export const missionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Nome obrigatório"),
  description: z.string().min(2, "Descrição obrigatória"),
  details: z.string().min(2, "Detalhes obrigatórios"),
  qrMission: z.boolean(),
  reviewers: z.array(z.string()),
  image: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
});

export type MissionFormType = z.infer<typeof missionSchema>;
