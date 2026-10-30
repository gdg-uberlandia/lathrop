export function resolveBucketName(appStorageBucket?: string) {
  const configuredBucket =
    process.env.FB_ADMIN_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_FB_BUCKET?.trim() ||
    appStorageBucket?.trim();

  if (!configuredBucket) {
    throw new Error("Firebase Storage bucket não configurado");
  }

  return configuredBucket.includes(".")
    ? configuredBucket
    : `${configuredBucket}.firebasestorage.app`;
}

export function createFirebaseDownloadUrl(
  bucketName: string,
  objectName: string,
  token: string,
) {
  return (
    `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}` +
    `/o/${encodeURIComponent(objectName)}?alt=media&token=${encodeURIComponent(token)}`
  );
}
