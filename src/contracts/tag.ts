import { z } from "zod";
import { urlSchema } from "./url";

export const tagFieldsSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    eventId: z.string().trim().min(1).max(128),
    qrId: z.string().uuid(),
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(500),
    imageUrl: urlSchema(),
    active: z.boolean(),
    order: z.number().int().nonnegative(),
    xpAwarded: z.number().int().positive().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const tagInputSchema = tagFieldsSchema.omit({
  eventId: true,
  createdAt: true,
  updatedAt: true,
});

export type Tag = z.infer<typeof tagFieldsSchema>;
export type TagInput = z.infer<typeof tagInputSchema>;
