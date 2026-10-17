import assert from "node:assert/strict";
import test from "node:test";
import { deliverNotice } from "../back-features/notice-delivery";
import { noticeInputSchema, pushSubscriptionSchema } from "../contracts/notice";

test("delivery records partial failure without aborting remaining recipients", async () => {
  const accepted: number[] = [];
  const totals = await deliverNotice(
    [1, 2, 3],
    async (recipient) => {
      if (recipient === 2) throw new Error("expired device");
      accepted.push(recipient);
    },
    async () => {},
  );
  assert.deepEqual(accepted, [1, 3]);
  assert.deepEqual(totals, { sent: 2, failed: 1, skipped: 0 });
});
test("delivery stops before request budget expires and reports skipped recipients", async () => {
  let time = 0;
  const recipients = Array.from({ length: 60 }, (_, index) => index);
  const totals = await deliverNotice(
    recipients,
    async () => {
      time = 41000;
    },
    async () => {},
    () => time,
  );
  assert.deepEqual(totals, { sent: 25, failed: 0, skipped: 35 });
});
test("publication rejects external links and client-selected events", () => {
  const input = {
    id: "123e4567-e89b-42d3-a456-426614174000",
    title: "Aviso",
    body: "Mensagem",
    link: "/talks",
    sendPush: true,
  };
  assert.equal(noticeInputSchema.safeParse(input).success, true);
  for (const link of ["https://example.com", "//example.com", "/\\example.com"])
    assert.equal(
      noticeInputSchema.safeParse({ ...input, link }).success,
      false,
    );
  assert.equal(
    noticeInputSchema.safeParse({ ...input, eventId: "other-event" }).success,
    false,
  );
});
test("subscription rejects endpoints outside push providers", () => {
  const keys = { p256dh: "a".repeat(87), auth: "b".repeat(22) };
  assert.equal(
    pushSubscriptionSchema.safeParse({
      endpoint: "https://fcm.googleapis.com/fcm/send/abc",
      keys,
    }).success,
    true,
  );
  assert.equal(
    pushSubscriptionSchema.safeParse({
      endpoint: "https://localhost/internal",
      keys,
    }).success,
    false,
  );
});
