import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdminWith } from "@/utils/api/require-admin-core";

const user = { uid: "admin-user" } as DecodedIdToken;
function response() {
  const state = { status: 200, body: undefined as unknown };
  const res = {
    status(code: number) {
      state.status = code;
      return this;
    },
    json(body: unknown) {
      state.body = body;
      return this;
    },
  } as unknown as NextApiResponse;
  return { res, state };
}
describe("requireAdmin", () => {
  it("mantém o 401 produzido pela autenticação quando não há sessão", async () => {
    const { res, state } = response();
    const result = await requireAdminWith({} as NextApiRequest, res, {
      requireAuth: async (_req, output) => {
        output.status(401).json({ error: "Não autenticado" });
        return null;
      },
      hasAdminRole: async () => false,
    });
    assert.equal(result, null);
    assert.equal(state.status, 401);
  });
  it("retorna 403 quando o perfil não possui admin", async () => {
    const { res, state } = response();
    const result = await requireAdminWith({} as NextApiRequest, res, {
      requireAuth: async () => user,
      hasAdminRole: async () => false,
    });
    assert.equal(result, null);
    assert.equal(state.status, 403);
  });
  it("autoriza o token quando o perfil possui admin", async () => {
    const { res } = response();
    const result = await requireAdminWith({} as NextApiRequest, res, {
      requireAuth: async () => user,
      hasAdminRole: async () => true,
    });
    assert.equal(result, user);
  });
});
