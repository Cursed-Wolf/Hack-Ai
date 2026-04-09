// ============================================================
// PlaceIQ — Firebase Initialization (React/Vite)
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDzOcoGPxtnAUCnxvSYLXTtX2UJaJNWgqQ",
    authDomain: "hack-ai-9efc4.firebaseapp.com",
    projectId: "hack-ai-9efc4",
    storageBucket: "hack-ai-9efc4.firebasestorage.app",
    messagingSenderId: "217378754816",
    appId: "1:217378754816:web:b72ed17a1bfa183ce1a3e5",
    measurementId: "G-EP91EKSGS2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
