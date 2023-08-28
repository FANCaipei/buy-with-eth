// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Functions, getFunctions, httpsCallable } from "firebase/functions";
import {
    Auth,
    User,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from "firebase/auth";
import useFirebaseAuth from "../zustand/useFirebaseAuth";

class FirebaseManager {
    static app: FirebaseApp;
    static analytics: Analytics;
    static firestore: Firestore;
    static auth: Auth;
    static functions: Functions;
    static serverCallFunctions: {
        createApp: (params: {
            logoUrl?: string;
            name: string;
            paymentAddress: string;
            callbackApi?: string;
        }) => Promise<any>;
        payBills: (params: { receiptId: string; periods: Array<string>; paymentType: string }) => Promise<any>;
    } = { createApp: () => Promise.reject(`hasn't init`), payBills: () => Promise.reject(`hasn't init`) };

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
            FirebaseManager.functions = getFunctions();
            // Init server call function
            FirebaseManager.serverCallFunctions.createApp = httpsCallable(FirebaseManager.functions, "createApp");
            FirebaseManager.serverCallFunctions.payBills = httpsCallable(FirebaseManager.functions, "payBills");

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
                (useFirebaseAuth.getState() as any)?.setReady(true);
                (useFirebaseAuth.getState() as any)?.setCurrentUser(user);
            });
        }
    }
    static async login(email: string, password: string): Promise<User> {
        if (!FirebaseManager.auth) {
            return Promise.reject("firebase manager not be init");
        }
        const userCredential = await signInWithEmailAndPassword(FirebaseManager.auth, email, password);
        await FirebaseManager.auth.currentUser?.reload();
        return userCredential.user;
    }
    static async signUp(email: string, password: string): Promise<User> {
        if (!FirebaseManager.auth) {
            return Promise.reject("firebase manager not be init");
        }
        const userCredential = await createUserWithEmailAndPassword(FirebaseManager.auth, email, password);
        try {
            await FirebaseManager.auth.currentUser?.reload();
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
    static uploadFileToFireStorage = (file: File, projectId: string): Promise<string> => {
        const currentUid = FirebaseManager.auth.currentUser?.uid;

        if (!currentUid) {
            console.error("no uid, please login before upload file");
            return Promise.reject();
        }

        const fileExtension = file.name.split(".").pop();
        const storage = getStorage();
        const storageRef = ref(storage, `appLogos/${currentUid}/${projectId}/logo.${fileExtension}`);
        // Upload the file and metadata
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                error => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case "storage/unauthorized":
                            // User doesn't have permission to access the object
                            break;
                        case "storage/canceled":
                            // User canceled the upload
                            break;
                        case "storage/unknown":
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                    reject();
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                        // console.log("File available at: ", downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        });
    };
}

export default FirebaseManager;
