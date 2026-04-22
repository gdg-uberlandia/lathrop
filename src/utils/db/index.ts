import admin from "firebase-admin";

interface Database extends admin.firestore.Firestore {}

let db: Database;

if (!admin.apps.length) {
  if (!process.env.FB_ADMIN_PRIVATE_KEY) {
    throw new Error(
      "Missing Firebase private key configuration in environment variables",
    );
  }
  if (!process.env.FB_ADMIN_DATABASE_URL) {
    throw new Error(
      "Missing Firebase database URL configuration in environment variables",
    );
  }
  if (!process.env.NEXT_PUBLIC_FB_PROJECT_ID) {
    throw new Error(
      "Missing Firebase project ID configuration in environment variables",
    );
  }
  if (!process.env.FB_ADMIN_CLIENT_EMAIL) {
    throw new Error(
      "Missing Firebase client email configuration in environment variables",
    );
  }
  const appName = process.env.NEXT_PUBLIC_FB_PROJECT_ID;
  const adminConfig = {
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
      clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FB_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FB_ADMIN_DATABASE_URL,
  };

  admin.initializeApp(adminConfig);

  db = admin.firestore();

  db.settings({ ignoreUndefinedProperties: true });
} else {
  db = admin.firestore();
}

const auth = admin.auth();
const storage = admin.storage();

export { admin, auth, db, storage };
