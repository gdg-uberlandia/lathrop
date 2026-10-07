import type { Profile } from "@/models/profile";
import { db } from "@/utils/db/index";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";

import { toAdminProfile } from "./profile-record";

const PROFILES_COLLECTION = getFirestoreCollectionName("profiles");

export const getAllProfiles = async (): Promise<Profile[]> => {
  const snapshot = await db.collection(PROFILES_COLLECTION).get();
  return snapshot.docs.flatMap((doc) => {
    const profile = toAdminProfile(doc.id, doc.data());
    return profile ? [profile] : [];
  });
};

export const searchProfilesByEmail = async (
  searchTerm: string,
): Promise<Profile[]> => {
  const term = searchTerm.trim();
  if (term.length < 2) return [];
  const lower = term.toLowerCase();
  const queries = [
    ["email", lower],
    ["displayName", term],
    ["user.email", lower],
    ["user.name", lower],
  ];
  const snapshots = await Promise.all(
    queries.map(([field, value]) =>
      db
        .collection(PROFILES_COLLECTION)
        .where(field, ">=", value)
        .where(field, "<=", value + "\uf8ff")
        .limit(10)
        .get(),
    ),
  );
  const profiles = new Map<string, Profile>();
  for (const snapshot of snapshots) {
    for (const doc of snapshot.docs) {
      const profile = toAdminProfile(doc.id, doc.data());
      if (profile) profiles.set(doc.id, profile);
    }
  }
  return [...profiles.values()]
    .sort((a, b) => a.email.localeCompare(b.email))
    .slice(0, 20);
};

export const getProfileById = async (profileId: string): Promise<Profile> => {
  if (!profileId) throw new Error("Id do profile obrigatório");
  const doc = await db.collection(PROFILES_COLLECTION).doc(profileId).get();
  if (!doc.exists) throw new Error("Perfil não encontrado.");
  const profile = toAdminProfile(doc.id, doc.data() ?? {});
  if (!profile) throw new Error("Dados inválidos para o perfil.");
  return profile;
};
