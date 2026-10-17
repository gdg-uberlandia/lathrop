import { z } from "zod";

export const ACCESS_ROLES = [
  "participant",
  "staff",
  "reviewer",
  "editor",
  "admin",
] as const;
export const participantRolesSchema = z
  .array(z.enum(ACCESS_ROLES))
  .min(1, "Selecione pelo menos um papel")
  .refine((roles) => new Set(roles).size === roles.length, "Papéis duplicados");
export const participantUpdateSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine((id) => !id.includes("/") && id !== "." && id !== ".."),
    accessRoles: participantRolesSchema.length(
      1,
      "Selecione exatamente um papel",
    ),
  })
  .strict();
export type AccessRole = (typeof ACCESS_ROLES)[number];
export type Participant = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  accessRoles: AccessRole[];
};
export type ParticipantUpdate = z.infer<typeof participantUpdateSchema>;
