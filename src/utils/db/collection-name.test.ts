import assert from "node:assert/strict";
import { it } from "node:test";
import { getFirestoreCollectionName } from "./collection-name";

it("usa prefixo test_ apenas quando DEV_MODE é true, inclusive false como texto", () => {
  const previous = process.env.DEV_MODE;
  try {
    for (const [value, expected] of [
      ["true", "test_profiles"],
      ["TRUE", "test_profiles"],
      ["false", "profiles"],
      ["", "profiles"],
    ]) {
      process.env.DEV_MODE = value;
      assert.equal(getFirestoreCollectionName("profiles"), expected);
    }
  } finally {
    if (previous === undefined) delete process.env.DEV_MODE;
    else process.env.DEV_MODE = previous;
  }
});
