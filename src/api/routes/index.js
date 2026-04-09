// ============================================================
// PlaceIQ — API Routes
// RESTful endpoints mapping requests to agent pipeline & data
// ============================================================

import { Router } from 'express';
import { runPipeline } from '../../agents/orchestrator.js';
import { students, companies, getStudentById } from '../../utils/mockData.js';
import { computeReadinessScore } from '../../core/readinessScore.js';
import { getAdminDashboard } from '../../core/adminIntel.js';
import { getAlertsForStudent } from '../../services/eventEngine.js';

const router = Router();

// ─── Student Endpoints ─────────────────────────────────────

/**
 * GET /api/students
 * Returns all students with computed readiness scores.
 */
router.get('/students', (req, res) => {
  const enriched = students.map(s => {
    const { readinessScore, breakdown } = computeReadinessScore(s);
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      branch: s.branch,
      semester: s.semester,
      cgpa: s.cgpa,
      skills: s.skills,
      mockInterviews: s.mockInterviews,
      resumeScore: s.resumeScore,
      lastActive: s.lastActive,
      readinessScore,
      projectCount: s.projects.length
    };
  });
  res.json({ success: true, count: enriched.length, data: enriched });
});

/**
 * GET /api/students/:id
 * Returns a single student with full details.
 */
router.get('/students/:id', (req, res) => {
  const student = getStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const { readinessScore, breakdown } = computeReadinessScore(student);
  res.json({
    success: true,
    data: {
      ...student,
      readinessScore,
      readinessBreakdown: breakdown
    }
  });
});

// ─── Company Endpoints ──────────────────────────────────────

/**
 * GET /api/companies
 * Returns all company profiles.
 */
router.get('/companies', (req, res) => {
  res.json({ success: true, count: companies.length, data: companies });
});

// ─── Analysis Endpoint ──────────────────────────────────────

/**
 * POST /api/analyze
 * Runs the FULL agent pipeline for a given student.
 * Body: { studentId, resumeText? }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { studentId, resumeText } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const result = await runPipeline(studentId, resumeText);

    if (result.error) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('[API] Analysis failed:', err);
    res.status(500).json({ error: 'Pipeline failed', message: err.message });
  }
});

// ─── Admin Endpoints ────────────────────────────────────────

/**
 * GET /api/admin/dashboard
 * Returns full admin intelligence payload.
 */
router.get('/admin/dashboard', (req, res) => {
  const dashboard = getAdminDashboard();
  res.json({ success: true, data: dashboard });
});

// ─── Alerts Endpoint ────────────────────────────────────────

/**
 * GET /api/alerts/:studentId
 * Returns current alerts for a specific student.
 */
router.get('/alerts/:studentId', (req, res) => {
  const alerts = getAlertsForStudent(req.params.studentId);
  res.json({ success: true, count: alerts.length, data: alerts });
});

export default router;
