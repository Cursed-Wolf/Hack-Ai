// ============================================================
// PlaceIQ — Admin Intelligence Layer
// Batch aggregation, at-risk detection, placement forecasting
// ============================================================

import { students } from '../utils/mockData.js';
import { computeReadinessScore } from './readinessScore.js';

/**
 * Get readiness scores for ALL students (batch).
 * @returns {Array} sorted by readinessScore ascending (weakest first)
 */
export function getAllReadinessScores() {
  return students.map(s => {
    const { readinessScore, breakdown } = computeReadinessScore(s);
    return {
      id: s.id,
      name: s.name,
      branch: s.branch,
      cgpa: s.cgpa,
      readinessScore,
      breakdown
    };
  }).sort((a, b) => a.readinessScore - b.readinessScore);
}

/**
 * Detect at-risk students (bottom 20% of readiness scores).
 */
export function getAtRiskStudents() {
  const all = getAllReadinessScores();
  const cutoff = Math.ceil(all.length * 0.2);
  return {
    atRisk: all.slice(0, cutoff),
    threshold: all[cutoff - 1]?.readinessScore || 0,
    totalStudents: all.length
  };
}

/**
 * Heuristic-based placement forecast.
 * Uses average readiness to project placement probability.
 */
export function getPlacementForecast() {
  const all = getAllReadinessScores();
  const scores = all.map(s => s.readinessScore);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Heuristic tiers
  const highReady = scores.filter(s => s >= 70).length;
  const midReady = scores.filter(s => s >= 45 && s < 70).length;
  const lowReady = scores.filter(s => s < 45).length;

  // Forecast: students with readiness >= 60 likely to be placed
  const estimatedPlacements = scores.filter(s => s >= 55).length;
  const placementRate = Math.round((estimatedPlacements / scores.length) * 100);

  return {
    averageReadiness: Math.round(avg),
    totalStudents: scores.length,
    estimatedPlacements,
    placementRate,
    distribution: {
      highReady,  // >= 70
      midReady,   // 45–69
      lowReady    // < 45
    }
  };
}

/**
 * Branch-level analytics.
 */
export function getBranchAnalytics() {
  const all = getAllReadinessScores();
  const branches = {};

  all.forEach(s => {
    if (!branches[s.branch]) {
      branches[s.branch] = { scores: [], count: 0 };
    }
    branches[s.branch].scores.push(s.readinessScore);
    branches[s.branch].count++;
  });

  return Object.entries(branches).map(([branch, data]) => ({
    branch,
    count: data.count,
    avgReadiness: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    highest: Math.max(...data.scores),
    lowest: Math.min(...data.scores)
  })).sort((a, b) => b.avgReadiness - a.avgReadiness);
}

/**
 * Full admin dashboard payload.
 */
export function getAdminDashboard() {
  return {
    forecast: getPlacementForecast(),
    atRisk: getAtRiskStudents(),
    branchAnalytics: getBranchAnalytics(),
    timestamp: new Date().toISOString()
  };
}
