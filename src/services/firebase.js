import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const usarEmulador =
    import.meta.env.DEV &&
    import.meta.env.MODE === 'test';

const app = initializeApp(
    usarEmulador
        ? {
            apiKey: 'fake-api-key',
            authDomain: 'demo-pokerota.firebaseapp.com',
            projectId: 'demo-pokerota',
        }
        : firebaseConfig
);

const auth = getAuth(app);
const db = getFirestore(app);

if (usarEmulador) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

export { auth, db };
export default app;