export type DeliveryTotals = { sent: number; failed: number; skipped: number };

// Await the complete broadcast inside the publication request. No background job.
export async function deliverNotice<T>(
  recipients: T[],
  send: (recipient: T) => Promise<void>,
  report: (totals: DeliveryTotals) => Promise<void>,
  now: () => number = Date.now,
): Promise<DeliveryTotals> {
  const totals = { sent: 0, failed: 0, skipped: 0 };
  const deadline = now() + 40000;
  for (let offset = 0; offset < recipients.length; offset += 25) {
    if (now() >= deadline) {
      totals.skipped = recipients.length - offset;
      break;
    }
    await Promise.all(
      recipients.slice(offset, offset + 25).map(async (recipient) => {
        try {
          await send(recipient);
          totals.sent++;
        } catch {
          totals.failed++;
        }
      }),
    );
    await report({ ...totals });
  }
  return totals;
}
