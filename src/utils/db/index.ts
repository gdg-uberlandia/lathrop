import admin from "firebase-admin";

interface Database extends admin.firestore.Firestore {}

let db: Database;

if (!admin.apps.length) {
  const projectId = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
  const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FB_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      // This is only needed by Realtime Database, not by Firestore.
      databaseURL: process.env.FB_ADMIN_DATABASE_URL,
      storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
    });
  } else if (
    process.env.FIREBASE_CONFIG ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT
  ) {
    // App Hosting supplies FIREBASE_CONFIG and Application Default Credentials
    // automatically in both the build and runtime environments.
    admin.initializeApp();
  } else {
    throw new Error(
      "Missing Firebase Admin configuration. Set FB_ADMIN_PRIVATE_KEY, " +
        "FB_ADMIN_CLIENT_EMAIL and NEXT_PUBLIC_FB_PROJECT_ID locally, or use " +
        "the credentials automatically provided by Firebase App Hosting.",
    );
  }

  db = admin.firestore();

  db.settings({ ignoreUndefinedProperties: true });
} else {
  db = admin.firestore();
}

const auth = admin.auth();
const storage = admin.storage();

export { admin, auth, db, storage };
