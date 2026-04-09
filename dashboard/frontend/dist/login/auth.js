// ============================================================
// auth.js — Login + Google Auth Logic
// ============================================================

import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { auth, db, googleProvider } from "./firebase.js";

// ─── SET YOUR REDIRECT PAGE HERE ────────────────────────────
// Change this to your main application page URL
const REDIRECT_URL = "/dashboard";
// ─────────────────────────────────────────────────────────────

// Helper: Save new users to Firestore
async function saveUserToFirestore(uid, email, provider) {
    try {
        await setDoc(doc(db, "users", uid), {
            uid: uid,
            email: email,
            provider: provider,
            createdAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error writing document to Firestore: ", e);
    }
}

// ADD THIS TO EXISTING LOGIN BUTTON — Email/Password Authentication (Login/Signup)
window.handleAuth = async (email, password, isLoginMode) => {
    try {
        if (isLoginMode) {
            // Login mode
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            // Signup mode
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await saveUserToFirestore(userCredential.user.uid, userCredential.user.email, "email");
        }
        
        // Redirect to main app on success
        window.location.href = REDIRECT_URL;
        
    } catch (error) {
        alert("Authentication Failed: " + error.message);
        console.error("Auth Error:", error);
    }
};

// ADD THIS TO GOOGLE SIGN-IN BUTTON — Google Sign-In
window.signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if user already exists in Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            await saveUserToFirestore(user.uid, user.email, "google");
        }
        
        // Redirect to main app on success
        window.location.href = REDIRECT_URL;
        
    } catch (error) {
        alert("Google Sign-In Failed: " + error.message);
        console.error("Google Auth Error:", error);
    }
};
