// ============================================================
// PlaceIQ — Navbar Component
// ============================================================

import React from 'react';
import { Brain, Bell, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import useStore from '../../store/useStore.js';

export default function Navbar({ user, onLogout }) {
  const { currentView, setCurrentView, notifications } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0 rounded-none px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('student')}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Place<span className="gradient-text">IQ</span>
            </h1>
            <p className="text-[10px] text-surface-200/60 -mt-0.5 tracking-widest uppercase">AI Placement Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentView === 'student'
                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                : 'text-surface-200 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentView === 'admin'
                ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                : 'text-surface-200 hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>

          {/* Notification Bell */}
          <div className="relative ml-2">
            <button className="btn-ghost relative p-2">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* ─── LOGOUT BUTTON ──────────────────────────── */}
          {user && (
            <button
              onClick={onLogout}
              title={`Logout (${user.email})`}
              className="flex items-center gap-2 px-3 py-2 ml-2 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
