import assert from "node:assert/strict";
import test from "node:test";
import { shouldDeleteNotice } from "../back-features/notice-deletion";

test("deletion only accepts existing notices from the current event", () => {
  assert.throws(() => shouldDeleteNotice(undefined, "current"));
  assert.throws(() => shouldDeleteNotice({ eventId: "other" }, "current"));
  assert.equal(shouldDeleteNotice({ eventId: "current" }, "current"), true);
});
test("repeated deletion preserves the original deletion audit", () => {
  assert.equal(
    shouldDeleteNotice(
      { eventId: "current", deletedAt: new Date() },
      "current",
    ),
    false,
  );
});
