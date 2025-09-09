// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app"
import { Auth, getAuth } from "firebase/auth"
import { FirebaseStorage, getStorage } from "firebase/storage"
import { Firestore, initializeFirestore } from "firebase/firestore" // ✅ updated import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Initialize Firebase
const currentApps = getApps()
let auth: Auth
let storage: FirebaseStorage
let db: Firestore

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  storage = getStorage(app)
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // ✅ fallback transport to avoid WebChannel 400 errors
  })
} else {
  const app = currentApps[0]
  auth = getAuth(app)
  storage = getStorage(app)
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // ✅ same fallback for already initialized app
  })
}

// Export initialized services
export { auth, storage, db }