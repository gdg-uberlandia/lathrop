import assert from "node:assert/strict";
import test from "node:test";
import { participantUpdateSchema } from "../contracts/participant";

test("accepts one Pokedex role and rejects multiple roles", () => {
  for (const role of ["participant", "staff", "reviewer", "editor", "admin"]) {
    assert.equal(
      participantUpdateSchema.safeParse({ id: "user", accessRoles: [role] })
        .success,
      true,
    );
  }
  assert.equal(
    participantUpdateSchema.safeParse({
      id: "user",
      accessRoles: ["participant", "admin"],
    }).success,
    false,
  );
});
test("rejects empty, duplicate, unknown roles and profile field changes", () => {
  for (const accessRoles of [[], ["admin", "admin"], ["owner"]])
    assert.equal(
      participantUpdateSchema.safeParse({ id: "user", accessRoles }).success,
      false,
    );
  assert.equal(
    participantUpdateSchema.safeParse({
      id: "user",
      accessRoles: ["admin"],
      xp: 999,
    }).success,
    false,
  );
  assert.equal(
    participantUpdateSchema.safeParse({
      id: "other/user",
      accessRoles: ["admin"],
    }).success,
    false,
  );
});
