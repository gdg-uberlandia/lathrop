import type { Profile } from "@/models/profile";

export function toAdminProfile(
  id: string,
  data: Record<string, unknown>,
): Profile | null {
  const legacy =
    data.user && typeof data.user === "object"
      ? (data.user as Record<string, unknown>)
      : {};
  const email = data.email ?? legacy.email;
  if (typeof email !== "string" || !email.trim()) return null;
  const name = data.displayName ?? legacy.name;
  const photo = data.avatarUrl ?? legacy.photoUrl;
  return {
    id,
    email,
    ...(typeof name === "string" ? { name } : {}),
    ...(typeof photo === "string" ? { photoURL: photo } : {}),
  };
}
