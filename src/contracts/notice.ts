import * as z from "zod";

export const noticeIdSchema = z.string().uuid();
export const noticeLinkSchema = z
  .string()
  .trim()
  .max(500)
  .refine((value) => {
    if (!value) return true;
    return (
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !/[\\\s\u0000-\u001f]/.test(value)
    );
  }, "Use um caminho da Pokedex, como /talks");
export const noticeInputSchema = z
  .object({
    id: noticeIdSchema,
    title: z.string().trim().min(3).max(100),
    body: z.string().trim().min(1).max(3000),
    link: noticeLinkSchema.default(""),
    sendPush: z.boolean(),
  })
  .strict();
export const noticeSchema = noticeInputSchema
  .extend({
    eventId: z.string().min(1),
    createdAt: z.string().datetime(),
  })
  .strip();
export type Notice = z.infer<typeof noticeSchema>;

export const pushSubscriptionSchema = z
  .object({
    endpoint: z
      .url()
      .max(2048)
      .refine((value) => {
        const url = new URL(value);
        return (
          url.protocol === "https:" &&
          !url.username &&
          !url.password &&
          !url.port &&
          ([
            "fcm.googleapis.com",
            "updates.push.services.mozilla.com",
            "web.push.apple.com",
          ].includes(url.hostname) ||
            url.hostname.endsWith(".notify.windows.com"))
        );
      }, "Provedor de push não suportado"),
    keys: z
      .object({
        p256dh: z.string().regex(/^[A-Za-z0-9_-]{87}={0,2}$/),
        auth: z.string().regex(/^[A-Za-z0-9_-]{22}={0,2}$/),
      })
      .strict(),
  })
  .strict();
