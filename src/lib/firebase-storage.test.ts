import assert from "node:assert/strict";
import test from "node:test";

import {
  createFirebaseDownloadUrl,
  resolveBucketName,
} from "./firebase-storage";

const bucketEnvironmentVariables = [
  "FB_ADMIN_STORAGE_BUCKET",
  "NEXT_PUBLIC_FB_STORAGE_BUCKET",
  "NEXT_PUBLIC_FB_BUCKET",
] as const;

function withoutBucketEnvironment(run: () => void) {
  const previousValues = Object.fromEntries(
    bucketEnvironmentVariables.map((name) => [name, process.env[name]]),
  );

  for (const name of bucketEnvironmentVariables) delete process.env[name];

  try {
    run();
  } finally {
    for (const name of bucketEnvironmentVariables) {
      const value = previousValues[name];
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

test("usa o bucket fornecido pelo Firebase App Hosting", () => {
  withoutBucketEnvironment(() => {
    assert.equal(
      resolveBucketName("devfest.appspot.com"),
      "devfest.appspot.com",
    );
  });
});

test("mantém compatibilidade com identificadores de bucket sem domínio", () => {
  withoutBucketEnvironment(() => {
    assert.equal(resolveBucketName("devfest"), "devfest.firebasestorage.app");
  });
});

test("gera URL de download do Firebase sem exigir assinatura da service account", () => {
  assert.equal(
    createFirebaseDownloadUrl(
      "devfest.firebasestorage.app",
      "speakers/speaker-1/photo com espaço.webp",
      "download-token",
    ),
    "https://firebasestorage.googleapis.com/v0/b/devfest.firebasestorage.app/o/speakers%2Fspeaker-1%2Fphoto%20com%20espa%C3%A7o.webp?alt=media&token=download-token",
  );
});
