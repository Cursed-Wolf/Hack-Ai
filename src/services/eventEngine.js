// ============================================================
// PlaceIQ — Event & Alert Engine
// Trigger-based system for real-time WebSocket alerts
// ============================================================

import { students, companies } from '../utils/mockData.js';
import { computeReadinessScore } from '../core/readinessScore.js';

let io = null;

/**
 * Initialize the Event Engine with Socket.IO instance.
 */
export function initEventEngine(socketIO) {
  io = socketIO;
  console.log('[EventEngine] Initialized');
}

/**
 * Check all trigger conditions and emit alerts.
 * Called periodically or after analysis runs.
 */
export function evaluateAlerts(studentId = null) {
  const alerts = [];
  const targetStudents = studentId
    ? students.filter(s => s.id === studentId)
    : students;

  for (const student of targetStudents) {
    // 1. Deadline alerts (< 3 days)
    const urgentCompanies = companies.filter(c => c.deadlineDays <= 3);
    urgentCompanies.forEach(c => {
      alerts.push({
        type: 'urgent_deadline',
        severity: 'critical',
        studentId: student.id,
        message: `⏰ ${c.name} deadline in ${c.deadlineDays} day(s)! Apply now for ${c.role}.`,
        companyId: c.id,
        timestamp: new Date().toISOString()
      });
    });

    // 2. Inactivity alerts (> 5 days)
    const lastActive = new Date(student.lastActive);
    const daysSinceActive = Math.floor((Date.now() - lastActive) / 86400000);
    if (daysSinceActive > 5) {
      alerts.push({
        type: 'inactivity_nudge',
        severity: 'warning',
        studentId: student.id,
        message: `👋 ${student.name} hasn't been active for ${daysSinceActive} days. Time to check new opportunities!`,
        timestamp: new Date().toISOString()
      });
    }

    // 3. Low resume score warning
    if (student.resumeScore < 40) {
      alerts.push({
        type: 'low_resume',
        severity: 'warning',
        studentId: student.id,
        message: `📄 Resume score is ${student.resumeScore}/100. Improving your resume can significantly boost placement chances.`,
        timestamp: new Date().toISOString()
      });
    }

    // 4. Low readiness alert
    const { readinessScore } = computeReadinessScore(student);
    if (readinessScore < 40) {
      alerts.push({
        type: 'low_readiness',
        severity: 'warning',
        studentId: student.id,
        message: `⚠️ Readiness score is ${readinessScore}/100. Action needed to improve placement prospects.`,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Emit via WebSocket if available
  if (io && alerts.length > 0) {
    alerts.forEach(alert => {
      io.emit('alert', alert);
    });
  }

  return alerts;
}

/**
 * Emit a custom event (e.g., new high match found).
 */
export function emitEvent(eventType, payload) {
  if (io) {
    io.emit(eventType, {
      ...payload,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get all current alerts for a student without emitting.
 */
export function getAlertsForStudent(studentId) {
  return evaluateAlerts(studentId);
}
