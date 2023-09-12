// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const FirebaseManager = {
    app: null,
    firebaseDB: null,
    init: () => {
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyBK20GGqYjmSmhRjLD77deBGo6qIKuic84",
            authDomain: "paywithcrypto-9283c.firebaseapp.com",
            projectId: "paywithcrypto-9283c",
            storageBucket: "paywithcrypto-9283c.appspot.com",
            messagingSenderId: "1698450909",
            appId: "1:1698450909:web:277d022dc0ef0e1d36ba34",
            measurementId: "G-2WXBGC0Z4M",
        };

        // Initialize Firebase
        if (!FirebaseManager.app) {
            FirebaseManager.app = initializeApp(firebaseConfig);
        }
        if (!FirebaseManager.firebaseDB) {
            FirebaseManager.firebaseDB = getFirestore(FirebaseManager.app);
        }
    },
    getAppConfig: async (appId: string): Promise<any> => {
        if (!FirebaseManager.firebaseDB) {
            return Promise.reject("firebase database not init");
        }
        // decode appId
        const documentIds = appId?.split("-");
        if ((documentIds?.length ?? 0) < 2) {
            return Promise.reject("appId not correct");
        }
        const userDocId = documentIds[0];
        const appDocId = documentIds[1];
        try {
            const [configDoc, userAppConfigDoc] = await Promise.all([
                getDoc(doc(FirebaseManager.firebaseDB, "userAppConfigs", userDocId, "apps", appDocId)),
                getDoc(doc(FirebaseManager.firebaseDB, "userAppConfigs", userDocId)),
            ]);

            let banned = false;
            if (!userAppConfigDoc.exists) {
                banned = true;
            } else if (userAppConfigDoc.data()?.hasUnpaiedBill) {
                banned = true;
            }

            if (banned) {
                return Promise.reject({ errorCode: 4003, msg: `access project config denied` });
            }

            if (configDoc.exists) {
                return configDoc.data();
            } else {
                return Promise.reject(`can't get project config`);
            }
        } catch (error) {
            return Promise.reject(`can't get project config`);
        }
    },
};

export default FirebaseManager;
