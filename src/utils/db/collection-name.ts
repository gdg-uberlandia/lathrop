const TEST_COLLECTION_PREFIX = "test_";

export function getFirestoreCollectionName(collectionName: string) {
  return process.env.DEV_MODE?.trim().toLowerCase() === "true"
    ? `${TEST_COLLECTION_PREFIX}${collectionName}`
    : collectionName;
}
