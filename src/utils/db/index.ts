import admin from 'firebase-admin';

interface Database extends admin.firestore.Firestore {
}

let db: Database;

if (!admin.apps.length) {


    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is not defined');
    }

    const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString()
    const serviceAccount = JSON.parse(serviceAccountString);

    const adminConfig = serviceAccount;
    adminConfig.credential = admin.credential.cert(serviceAccount);
    admin.initializeApp(adminConfig);

    db = admin.firestore();

    db.settings({ ignoreUndefinedProperties: true });

}
else {
    db = admin.firestore();
}

export default db;