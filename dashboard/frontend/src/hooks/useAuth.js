// ============================================================
// PlaceIQ — useAuth Hook (Pure State Manager)
// ============================================================
// ONLY manages Firebase auth state. Zero navigation logic.
// All redirect decisions are handled by ProtectedRoute in App.jsx.
// ============================================================

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase.js";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return { user, loading, logout };
}
