// ============================================================
// Firebase Initialization (Modular SDK v10+ via CDN)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzOcoGPxtnAUCnxvSYLXTtX2UJaJNWgqQ",
    authDomain: "hack-ai-9efc4.firebaseapp.com",
    projectId: "hack-ai-9efc4",
    storageBucket: "hack-ai-9efc4.firebasestorage.app",
    messagingSenderId: "217378754816",
    appId: "1:217378754816:web:b72ed17a1bfa183ce1a3e5",
    measurementId: "G-EP91EKSGS2"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
