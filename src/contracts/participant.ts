import { z } from "zod";

export const ACCESS_ROLES = [
  "participant",
  "staff",
  "reviewer",
  "sponsor",
  "editor",
  "admin",
] as const;
export const participantRolesSchema = z
  .array(z.enum(ACCESS_ROLES))
  .length(1, "Selecione exatamente um papel");
export const sponsorCompanyIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[^/]+$/)
  .nullable()
  .default(null);
export const participantUpdateSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine((id) => !id.includes("/") && id !== "." && id !== ".."),
    sponsorCompanyId: sponsorCompanyIdSchema,
    accessRoles: participantRolesSchema,
  })
  .strict()
  .superRefine((value, context) => {
    if (value.accessRoles[0] === "sponsor" && !value.sponsorCompanyId)
      context.addIssue({
        code: "custom",
        path: ["sponsorCompanyId"],
        message: "Selecione a empresa do funcionário",
      });
    if (value.accessRoles[0] !== "sponsor" && value.sponsorCompanyId)
      context.addIssue({
        code: "custom",
        path: ["sponsorCompanyId"],
        message: "Somente sponsors podem ter empresa vinculada",
      });
  });
export type AccessRole = (typeof ACCESS_ROLES)[number];
export type Participant = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  accessRoles: AccessRole[];
  sponsorCompanyId: string | null;
};
export type ParticipantUpdate = z.infer<typeof participantUpdateSchema>;
