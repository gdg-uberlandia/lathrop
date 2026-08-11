import { z } from "zod";

import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const PROFILES_COLLECTION = getFirestoreCollectionName("profiles");
const accessRolesSchema = z.array(
  z.enum(["participant", "staff", "reviewer", "editor", "admin"]),
);
const profileAuthorizationSchema = z.object({
  accessRoles: accessRolesSchema.default(["participant"]),
});

export async function getProfileAccessRoles(userId: string) {
  const profile = await db.collection(PROFILES_COLLECTION).doc(userId).get();
  if (!profile.exists) return [];

  const result = profileAuthorizationSchema.safeParse(profile.data());
  return result.success ? result.data.accessRoles : [];
}

export async function hasAdminRole(userId: string) {
  return (await getProfileAccessRoles(userId)).includes("admin");
}
