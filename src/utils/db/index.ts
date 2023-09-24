import { initializeApp } from "firebase-admin";
import { getFirestore, Firestore } from 'firebase-admin/firestore';

interface Database extends Firestore { }

let db: Database;


if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not defined');
}

const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString()
const serviceAccount = JSON.parse(serviceAccountString);

const adminConfig = serviceAccount;
//adminConfig.credential = admin.credential.cert(serviceAccount);
const app = initializeApp(adminConfig);

db = getFirestore(app);

export default db;