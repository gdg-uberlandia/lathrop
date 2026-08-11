import { z } from "zod";
import type admin from "firebase-admin";

import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const PROFILES_COLLECTION = getFirestoreCollectionName("profiles");
const accessRolesSchema = z.array(
  z.enum(["participant", "staff", "reviewer", "editor", "admin"]),
);
const profileAuthorizationSchema = z.object({
  accessRoles: accessRolesSchema.default(["participant"]),
});

function parseAccessRoles(profileData: unknown) {
  const result = profileAuthorizationSchema.safeParse(profileData);
  return result.success ? result.data.accessRoles : [];
}

export async function getProfileAccessRoles(user: admin.auth.DecodedIdToken) {
  const profiles = db.collection(PROFILES_COLLECTION);
  const profileByUid = await profiles.doc(user.uid).get();

  if (profileByUid.exists) {
    return parseAccessRoles(profileByUid.data());
  }

  if (!user.email || user.email_verified !== true) return [];

  const email = user.email.trim();
  const normalizedEmail = email.toLowerCase();
  const profileByEmail =
    email === normalizedEmail
      ? await profiles.where("email", "==", normalizedEmail).limit(2).get()
      : await profiles
          .where("email", "in", [email, normalizedEmail])
          .limit(2)
          .get();

  if (profileByEmail.size !== 1) return [];

  return parseAccessRoles(profileByEmail.docs[0].data());
}

export async function hasAdminRole(user: admin.auth.DecodedIdToken) {
  return (await getProfileAccessRoles(user)).includes("admin");
}
