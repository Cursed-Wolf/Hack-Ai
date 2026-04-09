// ============================================================
// PlaceIQ — Agent Orchestrator
// OBSERVE → REASON → PLAN → ACT → RETURN
// Uses ONE Gemini call for all AI explanations — fast pipeline
// ============================================================

import { companies, getStudentById } from '../utils/mockData.js';
import { analyzeResume } from './resumeAnalyzer.js';
import { matchStudentToAllCompanies } from './companyMatcher.js';
import { predictSelection } from './predictor.js';
import { generateActionPlan } from './planner.js';
import { generateAllExplanations } from './explainer.agent.js';
import { computeFinalScore, rankResults } from '../core/decisionEngine.js';
import { computeReadinessScore } from '../core/readinessScore.js';
import { initMemory, recordRecommendation, recordWeakness } from '../core/memoryLayer.js';

/**
 * Run the FULL agent pipeline for a student.
 * ONE Gemini call per analysis — fast and dynamic.
 */
export async function runPipeline(studentId, resumeText = null) {
  const startTime = Date.now();

  // === OBSERVE ===
  const student = getStudentById(studentId);
  if (!student) return { error: 'Student not found', studentId };

  initMemory(studentId, student.memory);
  const resume = resumeText || student.resumeText;

  // === STEP 1: Resume Analyzer ===
  const resumeAnalysis = analyzeResume(resume);
  if (resumeAnalysis.qualityScore) student.resumeScore = resumeAnalysis.qualityScore;
  resumeAnalysis.weaknesses.forEach(w => recordWeakness(studentId, w));

  // === STEP 2: Readiness Score ===
  const readiness = computeReadinessScore(student);

  // === STEP 3: Company Matcher ===
  const matchResults = matchStudentToAllCompanies(student, companies);

  // === STEP 4: Selection Predictor ===
  const predictions = matchResults.map(match => predictSelection(student, match));

  // === STEP 5: Decision Engine ===
  const scoredResults = matchResults.map((match, i) => {
    const prediction = predictions[i];
    const decision = computeFinalScore(match.matchScore, prediction.selectionProbability, match.deadlineDays);
    return { ...match, selectionProbability: prediction.selectionProbability, confidence: prediction.confidence, predictionModifiers: prediction.modifiers, ...decision };
  });

  const ranked = rankResults(scoredResults);
  ranked.slice(0, 5).forEach(r => recordRecommendation(studentId, r.companyId, r.finalScore));

  // === STEP 6: Action Planner ===
  const actionPlan = generateActionPlan(student, readiness, matchResults, predictions);

  // === STEP 7: Gemini Explainer — ONE single API call ===
  const { overall: aiAssessment, matchExplanations } = await generateAllExplanations(
    student, readiness, ranked, predictions, actionPlan.actions
  );

  // === RETURN ===
  return {
    success: true,
    student: {
      id: student.id, name: student.name, branch: student.branch,
      cgpa: student.cgpa, skills: student.skills, semester: student.semester
    },
    resumeAnalysis: {
      qualityScore: resumeAnalysis.qualityScore,
      weaknesses: resumeAnalysis.weaknesses,
      extractedSkills: resumeAnalysis.extractedData.skills,
      reasoning: resumeAnalysis.reasoning
    },
    readiness,
    matches: ranked.slice(0, 10).map(r => ({
      companyId: r.companyId, companyName: r.companyName, role: r.role,
      ctc: r.ctc, batch: r.batch, deadline: r.deadline, deadlineDays: r.deadlineDays,
      matchScore: r.matchScore, selectionProbability: r.selectionProbability,
      finalScore: r.finalScore, tier: r.tier, confidence: r.confidence,
      cgpaPassed: r.cgpaPassed, overlappingSkills: r.overlappingSkills,
      missingSkills: r.missingSkills,
      explanation: matchExplanations[r.companyId] || null
    })),
    actionPlan: actionPlan.actions,
    aiAssessment,
    explanation: aiAssessment,
    meta: {
      pipelineTime: `${Date.now() - startTime}ms`,
      agentsUsed: ['ResumeAnalyzer', 'CompanyMatcher', 'SelectionPredictor', 'ActionPlanner', 'Explainer'],
      totalCompaniesEvaluated: companies.length,
      geminiCalled: true,
      timestamp: new Date().toISOString()
    }
  };
}
