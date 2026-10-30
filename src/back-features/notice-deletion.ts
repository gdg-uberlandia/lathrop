export class NoticeNotFoundError extends Error {
  constructor() {
    super("Aviso não encontrado neste evento.");
    this.name = "NoticeNotFoundError";
  }
}

export function shouldDeleteNotice(
  data: Record<string, unknown> | undefined,
  eventId: string,
) {
  if (!data || data.eventId !== eventId) throw new NoticeNotFoundError();
  return data.deletedAt == null;
}
