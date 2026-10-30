import { z } from "zod";

export const schedulePublicationSchema = z
  .object({
    eventId: z.string().min(1),
    published: z.boolean(),
    publishedAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().nullable(),
  })
  .strict();
export const schedulePublicationInputSchema = z
  .object({ published: z.boolean() })
  .strict();
export type SchedulePublication = z.infer<typeof schedulePublicationSchema>;
