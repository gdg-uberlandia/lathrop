import { z } from "zod";

export const raffleFieldsSchema = z.object({
  id: z.string().trim().min(1).max(128),
  eventId: z.string().trim().min(1).max(128),
  prizeName: z.string().trim().min(1).max(120),
  description: z.string().trim().max(240).nullable(),
  imageUrl: z.url().nullable(),
  order: z.number().int().nonnegative(),
  active: z.boolean(),
  status: z.enum(["pending", "awaiting_confirmation", "drawn"]),
  currentAttemptId: z.string().trim().length(64).nullable().default(null),
  currentCandidateId: z
    .string()
    .trim()
    .min(1)
    .max(128)
    .nullable()
    .default(null),
  currentCandidateName: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .nullable()
    .default(null),
  winnerId: z.string().trim().min(1).max(128).nullable(),
  winnerName: z.string().trim().min(1).max(120).nullable(),
  eligibleParticipantCount: z.number().int().nonnegative().nullable(),
  eligibleTicketTotal: z.number().int().nonnegative().nullable(),
  randomOffset: z.number().int().nonnegative().nullable(),
  drawnAt: z.date().nullable(),
  drawnBy: z.string().trim().min(1).max(128).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Raffle = z.infer<typeof raffleFieldsSchema>;
