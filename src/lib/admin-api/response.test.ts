import assert from "node:assert/strict";
import test from "node:test";

import { AdminApiError } from "./errors";
import { isTransientHttpStatus, parseAdminApiResponse } from "./response";

test("identifica erros HTTP transitórios da infraestrutura", () => {
  assert.equal(isTransientHttpStatus(502), true);
  assert.equal(isTransientHttpStatus(503), true);
  assert.equal(isTransientHttpStatus(504), true);
  assert.equal(isTransientHttpStatus(500), false);
});

test("explica uma resposta 503 em texto sem expor a mensagem do proxy", async () => {
  const response = new Response(
    "upstream connect error or disconnect/reset before headers",
    {
      status: 503,
      headers: { "content-type": "text/plain" },
    },
  );

  await assert.rejects(
    () => parseAdminApiResponse(response),
    (error: unknown) => {
      assert.ok(error instanceof AdminApiError);
      assert.equal(error.status, 503);
      assert.equal(
        error.message,
        "O serviço está temporariamente indisponível (HTTP 503). Tente novamente em instantes.",
      );
      return true;
    },
  );
});

test("preserva mensagens de erro JSON produzidas pela aplicação", async () => {
  const response = Response.json(
    { error: "Formato de imagem inválido" },
    { status: 400 },
  );

  await assert.rejects(
    () => parseAdminApiResponse(response),
    (error: unknown) => {
      assert.ok(error instanceof AdminApiError);
      assert.equal(error.message, "Formato de imagem inválido");
      return true;
    },
  );
});
