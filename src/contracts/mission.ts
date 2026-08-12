import { z } from "zod";
import { urlSchema } from "./url";

export const missionValidationTypeSchema = z.enum([
  "qr",
  "reviewer",
  "automatic",
]);

export const missionProgressRequirementSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("connections"),
      target: z.number().int().positive(),
    })
    .strict(),
  z
    .object({
      type: z.literal("companies"),
      target: z.union([z.number().int().positive(), z.literal("all")]),
    })
    .strict(),
]);

export const missionPrerequisiteSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("company"),
      activityId: z.string().trim().min(1).max(128),
    })
    .strict(),
  z
    .object({
      type: z.literal("mission"),
      activityId: z.string().trim().min(1).max(128),
    })
    .strict(),
]);

const missionBaseSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    eventId: z.string().trim().min(1).max(128),
    qrId: z.string().uuid().nullable(),
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(1).max(1_000),
    imageUrl: urlSchema().nullable(),
    validationType: missionValidationTypeSchema,
    progressRequirement: missionProgressRequirementSchema
      .nullable()
      .default(null),
    prerequisites: z.array(missionPrerequisiteSchema).max(20).default([]),
    active: z.boolean(),
    order: z.number().int().nonnegative(),
    xpAwarded: z.number().int().positive().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

type MissionRules = {
  validationType: "qr" | "reviewer" | "automatic";
  qrId: string | null;
  progressRequirement?: unknown;
  prerequisites?: unknown[];
};

function validateMissionRules(mission: MissionRules, context: z.RefinementCtx) {
  if (mission.validationType === "qr" && !mission.qrId) {
    context.addIssue({
      code: "custom",
      path: ["qrId"],
      message: "Missões QR precisam de um identificador público",
    });
  }
  if (mission.validationType !== "qr" && mission.qrId) {
    context.addIssue({
      code: "custom",
      path: ["qrId"],
      message: "Apenas missões QR podem ter identificador público",
    });
  }
  if (mission.validationType === "automatic" && !mission.progressRequirement) {
    context.addIssue({
      code: "custom",
      path: ["progressRequirement"],
      message: "Defina o requisito de progresso",
    });
  }
  if (mission.validationType !== "automatic" && mission.progressRequirement) {
    context.addIssue({
      code: "custom",
      path: ["progressRequirement"],
      message: "Apenas missões automáticas possuem progresso",
    });
  }
  if (
    mission.validationType === "automatic" &&
    (mission.prerequisites?.length ?? 0) > 0
  ) {
    context.addIssue({
      code: "custom",
      path: ["prerequisites"],
      message: "Missões automáticas não possuem pré-requisitos",
    });
  }
}

export const missionFieldsSchema =
  missionBaseSchema.superRefine(validateMissionRules);

export const missionInputSchema = missionBaseSchema
  .omit({ eventId: true, createdAt: true, updatedAt: true })
  .superRefine(validateMissionRules);

export type Mission = z.infer<typeof missionFieldsSchema>;
export type MissionInput = z.infer<typeof missionInputSchema>;
export type MissionPrerequisite = z.infer<typeof missionPrerequisiteSchema>;
