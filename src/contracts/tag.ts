import { z } from "zod";

export const tagFieldsSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    eventId: z.string().trim().min(1).max(128),
    qrId: z.string().uuid(),
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(500),
    imageUrl: z.url(),
    active: z.boolean(),
    order: z.number().int().nonnegative(),
    xpAwarded: z.number().int().positive().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type Tag = z.infer<typeof tagFieldsSchema>;
