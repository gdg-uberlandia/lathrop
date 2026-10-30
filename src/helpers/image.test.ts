import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { shouldBypassImageOptimization } from "./image";

describe("shouldBypassImageOptimization", () => {
  it("ignora a otimização apenas para SVGs do DiceBear", () => {
    assert.equal(
      shouldBypassImageOptimization(
        "https://api.dicebear.com/9.x/pixel-art/svg?seed=Tim",
      ),
      true,
    );
  });

  it("mantém a otimização para imagens raster e SVGs não confiáveis", () => {
    assert.equal(
      shouldBypassImageOptimization("https://api.dicebear.com/avatar.png"),
      false,
    );
    assert.equal(
      shouldBypassImageOptimization("https://example.com/avatar.svg"),
      false,
    );
  });
});
