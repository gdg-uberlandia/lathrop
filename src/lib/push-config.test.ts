import assert from "node:assert/strict";
import test from "node:test";
import { isPushEnabled } from "../back-features/push-config";

test("global push requires explicit activation", () => {
  const original = process.env.PUSH_ENABLED;
  try {
    delete process.env.PUSH_ENABLED;
    assert.equal(isPushEnabled(), false);
    for (const value of ["", "false", "1", "yes"]) {
      process.env.PUSH_ENABLED = value;
      assert.equal(isPushEnabled(), false);
    }
    process.env.PUSH_ENABLED = " TRUE ";
    assert.equal(isPushEnabled(), true);
  } finally {
    if (original === undefined) delete process.env.PUSH_ENABLED;
    else process.env.PUSH_ENABLED = original;
  }
});
