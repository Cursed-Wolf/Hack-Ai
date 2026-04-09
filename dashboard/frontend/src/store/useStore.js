// ============================================================
// PlaceIQ — Zustand State Store
// Lightweight global state for dashboard data & alerts
// ============================================================

import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ─── Student Data ─────────────────────────────
  students: [],
  selectedStudent: null,
  companies: [],

  // ─── Analysis Results ─────────────────────────
  analysisResult: null,
  isAnalyzing: false,

  // ─── Admin Data ───────────────────────────────
  adminDashboard: null,

  // ─── Alerts ───────────────────────────────────
  alerts: [],
  notifications: [],

  // ─── UI State ─────────────────────────────────
  currentView: 'student', // 'student' | 'admin'
  loading: false,

  // ─── Actions ──────────────────────────────────
  setStudents: (students) => set({ students }),
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  setCompanies: (companies) => set({ companies }),
  setAnalysisResult: (result) => set({ analysisResult: result, isAnalyzing: false }),
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),
  setAdminDashboard: (data) => set({ adminDashboard: data }),
  setCurrentView: (view) => set({ currentView: view }),
  setLoading: (val) => set({ loading: val }),

  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts].slice(0, 50),
    notifications: [
      { ...alert, id: Date.now(), read: false },
      ...state.notifications
    ].slice(0, 20)
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  })),

  clearAnalysis: () => set({ analysisResult: null }),
}));

export default useStore;
