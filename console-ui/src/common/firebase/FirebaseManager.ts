// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore } from "firebase/firestore";
import {
    Auth,
    User,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from "firebase/auth";

class FirebaseManager {
    static app: FirebaseApp;
    static analytics: Analytics;
    static firestore: Firestore;
    static auth: Auth;
    static init() {
        if (!FirebaseManager.app) {
            // Your web app's Firebase configuration
            // For Firebase JS SDK v7.20.0 and later, measurementId is optional
            const firebaseConfig = {
                apiKey: "AIzaSyBK20GGqYjmSmhRjLD77deBGo6qIKuic84",
                authDomain: "paywithcrypto-9283c.firebaseapp.com",
                projectId: "paywithcrypto-9283c",
                storageBucket: "paywithcrypto-9283c.appspot.com",
                messagingSenderId: "1698450909",
                appId: "1:1698450909:web:e866fd6cb187042236ba34",
                measurementId: "G-WR3KECNVMK",
            };

            // Initialize Firebase
            FirebaseManager.app = initializeApp(firebaseConfig);
            FirebaseManager.analytics = getAnalytics(FirebaseManager.app);
            FirebaseManager.firestore = getFirestore(FirebaseManager.app);
            FirebaseManager.auth = getAuth(FirebaseManager.app);

            onAuthStateChanged(FirebaseManager.auth, user => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/auth.user
                    if (!user.emailVerified) {
                        // TODO: navigate to send verify email page
                    }
                    // ...
                } else {
                    // User is signed out
                    // TODO: navigate to auth page
                }
            });
        }
    }
    static async login(email: string, password: string): Promise<User> {
        if (!FirebaseManager.auth) {
            return Promise.reject("firebase manager not be init");
        }
        const userCredential = await signInWithEmailAndPassword(FirebaseManager.auth, email, password);
        return userCredential.user;
    }
    static async signIn(email: string, password: string): Promise<User> {
        if (!FirebaseManager.auth) {
            return Promise.reject("firebase manager not be init");
        }
        const userCredential = await createUserWithEmailAndPassword(FirebaseManager.auth, email, password);
        try {
            await FirebaseManager.sendVerifyEmail();
        } catch (error) {
            // do nothing
        }
        return userCredential.user;
    }
    static sendVerifyEmail(): Promise<void> {
        if (!FirebaseManager.auth) {
            return Promise.reject("firebase manager not be init");
        }
        if (!FirebaseManager.auth.currentUser) {
            return Promise.reject("no current user, please login or signIn first");
        }

        return sendEmailVerification(FirebaseManager.auth.currentUser);
    }
}

export default FirebaseManager;
