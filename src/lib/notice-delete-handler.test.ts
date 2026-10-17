import assert from "node:assert/strict";
import test from "node:test";
import type { NextApiRequest, NextApiResponse } from "next";
import { createNoticeDeleteHandler } from "../utils/api/notice-delete-handler";
import { NoticeNotFoundError } from "../back-features/notice-deletion";

const id = "123e4567-e89b-42d3-a456-426614174000";
function response() {
  const state = { status: 200, body: undefined as unknown };
  const res = {
    setHeader() {},
    status(code: number) {
      state.status = code;
      return res;
    },
    json(body: unknown) {
      state.body = body;
      return res;
    },
  };
  return { state, res: res as unknown as NextApiResponse };
}
const request = (noticeId: unknown = id, method = "DELETE") =>
  ({ method, query: { noticeId } }) as unknown as NextApiRequest;

test("deletes using only the URL and server-authorized administrator", async () => {
  const { state, res } = response();
  const handler = createNoticeDeleteHandler({
    authorize: async () => ({ uid: "admin" }),
    enabled: () => true,
    remove: async (noticeId, uid) => {
      assert.equal(noticeId, id);
      assert.equal(uid, "admin");
      return noticeId;
    },
  });
  await handler(request(), res);
  assert.equal(state.status, 200);
  assert.deepEqual(state.body, { id });
});
test("rejects invalid ids before persistence", async () => {
  const { state, res } = response();
  await createNoticeDeleteHandler({
    authorize: async () => ({ uid: "admin" }),
    enabled: () => true,
    remove: async () => {
      assert.fail("must not delete");
    },
  })(request("invalid"), res);
  assert.equal(state.status, 400);
  assert.equal(typeof (state.body as { error: string }).error, "string");
});
test("requires administrator authorization and enabled feature", async () => {
  for (const authorized of [false, true]) {
    const { state, res } = response();
    await createNoticeDeleteHandler({
      authorize: async () => {
        if (!authorized) {
          res.status(403).json({ error: "Forbidden" });
          return null;
        }
        return { uid: "admin" };
      },
      enabled: () => false,
      remove: async () => {
        assert.fail("must not delete");
      },
    })(request(), res);
    assert.equal(state.status, authorized ? 404 : 403);
  }
});
test("returns an actionable error for an unavailable notice", async () => {
  const { state, res } = response();
  await createNoticeDeleteHandler({
    authorize: async () => ({ uid: "admin" }),
    enabled: () => true,
    remove: async () => {
      throw new NoticeNotFoundError();
    },
  })(request(), res);
  assert.equal(state.status, 404);
  assert.match((state.body as { error: string }).error, /não encontrado/);
});
