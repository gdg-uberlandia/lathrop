import assert from "node:assert/strict";
import { it } from "node:test";
import { toAdminProfile } from "./profile-record";

it("lê perfis atuais da Pokedex pelo ID do documento sem depender de data.id", () => {
  assert.deepEqual(
    toAdminProfile("google-sub", {
      userId: "google-sub",
      email: "user@example.com",
      displayName: "Pessoa",
      avatarUrl: null,
    }),
    { id: "google-sub", email: "user@example.com", name: "Pessoa" },
  );
});
it("mantém compatibilidade com perfis antigos", () => {
  assert.deepEqual(
    toAdminProfile("legacy", {
      user: {
        email: "user@example.com",
        name: "Pessoa",
        photoUrl: "https://example.com/photo.png",
      },
    }),
    {
      id: "legacy",
      email: "user@example.com",
      name: "Pessoa",
      photoURL: "https://example.com/photo.png",
    },
  );
});
it("não publica campos de autorização ou perfis sem email", () => {
  assert.equal(toAdminProfile("invalid", { accessRoles: ["admin"] }), null);
  assert.deepEqual(
    toAdminProfile("user", {
      email: "user@example.com",
      accessRoles: ["admin"],
    }),
    { id: "user", email: "user@example.com" },
  );
});
