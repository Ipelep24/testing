// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbEjRIIhmmhO2AYguwj7vVjRVvhdt2uic",
    authDomain: "virtu-sense.firebaseapp.com",
    projectId: "virtu-sense",
    storageBucket: "virtu-sense.firebasestorage.app",
    messagingSenderId: "856807042524",
    appId: "1:856807042524:web:eba3eaef8526a028b5f319"
};

// Initialize Firebase
const currentApps = getApps();
let auth: Auth;
let storage: FirebaseStorage;
let db: Firestore;

if (!currentApps.length) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
    db = getFirestore(app);
} else {
    const app = currentApps[0];
    auth = getAuth(app);
    storage = getStorage(app);
    db = getFirestore(app);
}

export { auth, storage, db };
//import {auth} from "@/firebase/firebase"