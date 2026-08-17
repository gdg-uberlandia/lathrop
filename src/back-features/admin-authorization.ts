import { z } from "zod";
import type admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

import {
  buildInitialAdminProfile,
  getAdminProfileIdentity,
  resolveAdminProfileDocumentId,
} from "@/back-features/admin-profile";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

const PROFILES_COLLECTION = getFirestoreCollectionName("profiles");
const ADMIN_USERS_COLLECTION = getFirestoreCollectionName("adminUsers");
const accessRolesSchema = z.array(
  z.enum(["participant", "staff", "reviewer", "editor", "admin"]),
);
type AccessRole = z.infer<typeof accessRolesSchema>[number];
const adminUserAuthorizationSchema = z.object({
  isActive: z.literal(true),
});

export async function getProfileAccessRoles(
  user: admin.auth.DecodedIdToken,
): Promise<AccessRole[]> {
  const isPasswordSignIn = user.firebase?.sign_in_provider === "password";
  if (!isPasswordSignIn || !user.email) {
    return [];
  }

  const identity = getAdminProfileIdentity(user);
  if (!identity) return [];

  const adminUserRef = db.collection(ADMIN_USERS_COLLECTION).doc(user.uid);
  const profiles = db.collection(PROFILES_COLLECTION);
  const directProfileRef = profiles.doc(user.uid);
  const profilesByEmailQuery = profiles
    .where("email", "==", identity.email)
    .limit(2);

  return db.runTransaction<AccessRole[]>(async (transaction) => {
    const [adminUser, directProfile, profilesByEmail] = await Promise.all([
      transaction.get(adminUserRef),
      transaction.get(directProfileRef),
      transaction.get(profilesByEmailQuery),
    ]);

    const authorization = adminUserAuthorizationSchema.safeParse(
      adminUser.data(),
    );
    if (!adminUser.exists || !authorization.success) return [];

    const profileId = resolveAdminProfileDocumentId({
      uid: user.uid,
      directProfileExists: directProfile.exists,
      emailProfileIds: profilesByEmail.docs.map((document) => document.id),
    });
    if (!profileId) return [];

    const profile =
      profileId === user.uid
        ? directProfile
        : profilesByEmail.docs.find((document) => document.id === profileId);
    if (!profile) return [];

    const currentRoles = accessRolesSchema.safeParse(
      profile.data()?.accessRoles,
    );
    if (
      profile.exists &&
      currentRoles.success &&
      currentRoles.data.length === 1 &&
      currentRoles.data[0] === "admin"
    ) {
      return ["admin"];
    }

    const now = Timestamp.now();
    const profileRef = profiles.doc(profileId);
    if (profile.exists) {
      transaction.update(profileRef, {
        accessRoles: ["admin"],
        updatedAt: now,
      });
    } else {
      const initialProfile = buildInitialAdminProfile(user, now);
      if (!initialProfile) return [];
      transaction.create(profileRef, initialProfile);
    }

    return ["admin"];
  });
}

export async function hasAdminRole(user: admin.auth.DecodedIdToken) {
  return (await getProfileAccessRoles(user)).includes("admin");
}
