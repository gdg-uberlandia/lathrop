import admin from 'firebase-admin';
const serviceAccount = require('../../../serviceAccount.json');

interface Database extends admin.firestore.Firestore {
}

let db: Database;
if (!admin.apps.length) {
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