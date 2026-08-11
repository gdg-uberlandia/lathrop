import { Profile } from "@/models/profile";
import { adminApiRequest } from "@/lib/admin-api/client";

export const getProfilesAPI = (signal?: AbortSignal) =>
  adminApiRequest<Profile[]>("/api/v1/profiles", { signal });
