import { z } from "zod";

export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const urlSchema = (message = "URL inválida") =>
  z.string().trim().transform(normalizeUrl).pipe(z.url(message));

export const optionalFormUrlSchema = (message = "URL inválida") =>
  z.union([z.literal(""), urlSchema(message)]);
