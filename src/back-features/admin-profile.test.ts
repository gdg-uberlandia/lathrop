import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DecodedIdToken } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";

import {
  buildInitialAdminProfile,
  getAdminProfileIdentity,
  resolveAdminProfileDocumentId,
} from "./admin-profile";

const user = {
  uid: "admin-user",
  email: "Admin@Example.com",
  name: "Admin User",
  firebase: { sign_in_provider: "password" },
} as unknown as DecodedIdToken;

describe("admin profile", () => {
  it("normaliza a identidade autenticada", () => {
    assert.deepEqual(getAdminProfileIdentity(user), {
      displayName: "Admin User",
      email: "admin@example.com",
      avatarUrl: null,
    });
  });

  it("usa a parte local do email quando o usuário não possui nome", () => {
    assert.equal(
      getAdminProfileIdentity({ ...user, name: undefined })?.displayName,
      "admin",
    );
  });

  it("não cria identidade sem email", () => {
    assert.equal(getAdminProfileIdentity({ ...user, email: undefined }), null);
  });

  it("cria um perfil exclusivamente administrativo e já finalizado", () => {
    const now = Timestamp.fromMillis(1_700_000_000_000);
    const profile = buildInitialAdminProfile(user, now);

    assert.ok(profile);
    assert.deepEqual(profile.accessRoles, ["admin"]);
    assert.equal(profile.onboardingCompleted, true);
    assert.equal(profile.userId, user.uid);
    assert.equal(profile.createdAt, now);
    assert.equal(profile.updatedAt, now);
    assert.match(profile.qrId, /^[0-9a-f-]{36}$/);
  });

  it("reutiliza o perfil criado pela Pokedex quando o UID é diferente", () => {
    assert.equal(
      resolveAdminProfileDocumentId({
        uid: "firebase-uid",
        directProfileExists: false,
        emailProfileIds: ["google-sub"],
      }),
      "google-sub",
    );
  });

  it("usa o Firebase UID quando ainda não existe perfil", () => {
    assert.equal(
      resolveAdminProfileDocumentId({
        uid: "firebase-uid",
        directProfileExists: false,
        emailProfileIds: [],
      }),
      "firebase-uid",
    );
  });

  it("rejeita perfis duplicados para o mesmo email", () => {
    assert.equal(
      resolveAdminProfileDocumentId({
        uid: "firebase-uid",
        directProfileExists: false,
        emailProfileIds: ["first-profile", "second-profile"],
      }),
      null,
    );
  });

  it("rejeita conflito entre o perfil por UID e outro perfil por email", () => {
    assert.equal(
      resolveAdminProfileDocumentId({
        uid: "firebase-uid",
        directProfileExists: true,
        emailProfileIds: ["google-sub"],
      }),
      null,
    );
  });
});
