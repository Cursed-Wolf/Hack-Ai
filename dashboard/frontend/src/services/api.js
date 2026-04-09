// ============================================================
// PlaceIQ — API Service (Axios)
// Configured instance for all REST calls to backend
// ============================================================

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
const api = axios.create({
  baseURL,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
});

// ─── Student APIs ───────────────────────────────────────────

export async function fetchStudents() {
  const { data } = await api.get('/students');
  return data.data;
}

export async function fetchStudentById(id) {
  const { data } = await api.get(`/students/${id}`);
  return data.data;
}

// ─── Company APIs ───────────────────────────────────────────

export async function fetchCompanies() {
  const { data } = await api.get('/companies');
  return data.data;
}

// ─── Analysis API ───────────────────────────────────────────

export async function runAnalysis(studentId, resumeText = null) {
  const { data } = await api.post('/analyze', { studentId, resumeText });
  return data;
}

// ─── Admin API ──────────────────────────────────────────────

export async function fetchAdminDashboard() {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
}

// ─── Alerts API ─────────────────────────────────────────────

export async function fetchAlerts(studentId) {
  const { data } = await api.get(`/alerts/${studentId}`);
  return data.data;
}

export default api;
