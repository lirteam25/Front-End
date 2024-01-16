import { initializeApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: process.env.FIREBASE_CONF_APIKEY,
    authDomain: process.env.FIREBASE_CONF_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_CONF_DATABASE_URL,
    projectId: process.env.FIREBASE_CONF_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CONF_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_CONF_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_CONF_APP_ID,
    measurementId: process.env.FIREBASE_CONF_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };