// ============================================================
// PlaceIQ — App.jsx (Main Router Hub)
// ============================================================
// Architecture:
//   useAuth()        → pure state (no navigation)
//   ProtectedRoute   → declarative gate (loading/redirect/render)
//   RedirectToLogin  → one-shot escape from SPA to static HTML
//   DashboardApp     → inner layout (only renders when authed)
// ============================================================

import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import StudentHome from './pages/StudentHome.jsx';
import AdminHome from './pages/AdminHome.jsx';
import useStore from './store/useStore.js';
import { initSocket } from './services/socket.js';
import { useAuth } from './hooks/useAuth.js';

// ─── LOADING SCREEN ──────────────────────────────────────────
function LoadingScreen({ message = "Verifying authentication..." }) {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-surface-200/60 text-sm animate-pulse">
        {message}
      </div>
    </div>
  );
}

// ─── REDIRECT TO LOGIN (ESCAPE SPA) ─────────────────────────
// This is a one-shot component that exits the React SPA entirely
// and loads the static login HTML page served by Firebase Hosting.
// The useRef guard ensures it only fires ONCE, preventing loops.
function RedirectToLogin() {
  const fired = useRef(false);

  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      window.location.replace("/login/");
    }
  }, []);

  return <LoadingScreen message="Redirecting to login..." />;
}

// ─── PROTECTED ROUTE ─────────────────────────────────────────
// Declarative auth gate. No imperative navigation.
//   loading → show spinner (prevents premature redirect)
//   !user   → render RedirectToLogin (one-shot SPA escape)
//   user    → render children
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <RedirectToLogin />;
  }

  return children;
}

// ─── DASHBOARD LAYOUT ────────────────────────────────────────
// Only renders when ProtectedRoute has confirmed authentication.
function DashboardApp() {
  const { currentView } = useStore();
  const { user, logout } = useAuth();

  useEffect(() => {
    initSocket();
  }, []);

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar user={user} onLogout={logout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12">
        {currentView === 'student' && <StudentHome />}
        {currentView === 'admin' && <AdminHome />}
      </main>

      <footer className="border-t border-white/5 py-6 text-center">
        <p className="text-xs text-surface-200/30">
          PlaceIQ — AI-Powered Placement Intelligence • Built with deterministic reasoning
        </p>
      </footer>
    </div>
  );
}

// ─── ROOT ROUTER ─────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardApp />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
