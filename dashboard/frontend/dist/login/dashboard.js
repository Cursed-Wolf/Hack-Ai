// ============================================================
// dashboard.js — Auth Protection + Logout (for plain HTML pages)
// ============================================================
// ADD THIS SCRIPT TO ANY PAGE YOU WANT TO PROTECT
// <script type="module" src="../login/dashboard.js"></script>

import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { auth } from "./firebase.js";

// ─── SET YOUR LOGIN PAGE HERE ───────────────────────────────
const LOGIN_URL = "/login";
// ─────────────────────────────────────────────────────────────

// Auth state listener — protects the page
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ Authenticated User:", user.email);
        // You can update UI based on the user here
    } else {
        // Not authenticated → redirect to login
        window.location.href = LOGIN_URL;
    }
});

// Logout function — attach to any logout button
// Example: <button onclick="logoutUser()">Logout</button>
window.logoutUser = () => {
    signOut(auth).then(() => {
        window.location.href = LOGIN_URL;
    }).catch((error) => {
        console.error("Sign out error:", error);
    });
};
