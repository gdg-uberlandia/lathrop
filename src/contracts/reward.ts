import { z } from "zod";
import { urlSchema } from "./url";

export const rewardFieldsSchema = z.object({
  id: z.string().trim().min(1).max(128),
  eventId: z.string().trim().min(1).max(128),
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(240),
  imageUrl: urlSchema(),
  ticketCost: z.number().int().positive().max(1_000),
  stock: z.number().int().nonnegative(),
  redemptionLimit: z.number().int().positive().max(100).nullable(),
  active: z.boolean(),
  order: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Reward = z.infer<typeof rewardFieldsSchema>;

export const rewardInputSchema = rewardFieldsSchema
  .pick({
    id: true,
    name: true,
    description: true,
    imageUrl: true,
    ticketCost: true,
    stock: true,
    redemptionLimit: true,
    active: true,
    order: true,
  })
  .extend({
    id: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .regex(/^[^/]+$/)
      .refine((value) => value !== "." && value !== ".."),
  })
  .strict();
export const rewardUpdateSchema = rewardInputSchema
  .extend({
    expectedUpdatedAt: z.string().datetime(),
  })
  .strict();
export type RewardInput = z.infer<typeof rewardInputSchema>;
export type RewardUpdate = z.infer<typeof rewardUpdateSchema>;
