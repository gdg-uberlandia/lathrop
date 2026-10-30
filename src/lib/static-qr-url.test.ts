import assert from "node:assert/strict";
import { it as runTest } from "node:test";
import { buildStaticQrPath } from "./static-qr-code.mjs";
import { buildStaticQrUrl } from "./static-qr-url";

it("uses the same short QR paths as the Pokedex and image generator", () => {
  const uuid = "123e4567-e89b-42d3-a456-426614174000";
  for (const [type, prefix] of [
    ["company", "c"],
    ["tag", "t"],
    ["mission", "m"],
  ] as const) {
    const path = `/q/${prefix}Ej5FZ-ibQtOkVkJmFBdAAA`;
    assert.equal(buildStaticQrPath(type, uuid), path);
    assert.equal(new URL(buildStaticQrUrl(type, uuid)).pathname, path);
  }
  assert.throws(() => buildStaticQrPath("tag", "not-a-uuid"));
});

it("uses the selected environment URL for production and local generation", () => {
  for (const origin of [
    "https://pokedex.example.com",
    "http://localhost:3001",
  ]) {
    process.env.NEXT_PUBLIC_APP_URL = origin;
    assert.equal(
      new URL(buildStaticQrUrl("tag", "123e4567-e89b-42d3-a456-426614174000"))
        .origin,
      origin,
    );
  }
});
it("requires NEXT_PUBLIC_APP_URL instead of silently using production", () => {
  delete process.env.NEXT_PUBLIC_APP_URL;
  assert.throws(
    () => buildStaticQrUrl("tag", "123e4567-e89b-42d3-a456-426614174000"),
    /NEXT_PUBLIC_APP_URL/,
  );
});

function it(name: string, run: () => void) {
  runTest(name, () => {
    const previous = process.env.NEXT_PUBLIC_APP_URL;
    process.env.NEXT_PUBLIC_APP_URL = "https://pokedex.example.com";
    try {
      run();
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
      else process.env.NEXT_PUBLIC_APP_URL = previous;
    }
  });
}
