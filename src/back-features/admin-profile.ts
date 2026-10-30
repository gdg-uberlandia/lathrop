import { randomUUID } from "node:crypto";

import type admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

import { CURRENT_EVENT_ID } from "@/helpers/event";

export function getAdminProfileIdentity(
  user: admin.auth.DecodedIdToken,
): { displayName: string; email: string; avatarUrl: string | null } | null {
  const email = user.email?.trim().toLowerCase();
  if (!email) return null;

  return {
    displayName: user.name?.trim() || email.split("@")[0] || email,
    email,
    avatarUrl: user.picture?.trim() || null,
  };
}

export function resolveAdminProfileDocumentId({
  uid,
  directProfileExists,
  emailProfileIds,
}: {
  uid: string;
  directProfileExists: boolean;
  emailProfileIds: string[];
}) {
  const uniqueEmailProfileIds = [...new Set(emailProfileIds)];
  if (uniqueEmailProfileIds.length > 1) return null;

  const emailProfileId = uniqueEmailProfileIds[0];
  if (directProfileExists) {
    return emailProfileId && emailProfileId !== uid ? null : uid;
  }

  return emailProfileId ?? uid;
}

export function buildInitialAdminProfile(
  user: admin.auth.DecodedIdToken,
  now = Timestamp.now(),
) {
  const identity = getAdminProfileIdentity(user);
  if (!identity) return null;

  return {
    userId: user.uid,
    eventId: CURRENT_EVENT_ID,
    ...identity,
    gender: null,
    bio: null,
    role: null,
    company: null,
    linkedinUsername: null,
    website: null,
    skills: [],
    accessRoles: ["admin"],
    ticketBalance: 0,
    convertedXp: 0,
    qrId: randomUUID(),
    onboardingCompleted: true,
    onboardingTicketGranted: false,
    xp: 0,
    xpReachedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}
