// ============================================================
// PlaceIQ — Action Planner Agent
// OBSERVE → REASON → PLAN → ACT → RETURN
// Focus: Actionable insights from weaknesses, avoids repeating advice
// ============================================================

import { getMemory, recordAdvice, wasAdviceGiven } from '../core/memoryLayer.js';

// Action templates mapped to weakness categories
const ACTION_TEMPLATES = {
  lowCGPA: [
    'Focus on improving academic performance in remaining semesters',
    'Target companies with flexible CGPA criteria',
    'Highlight practical projects to offset lower CGPA'
  ],
  missingSkills: (skills) => [
    `Learn ${skills.slice(0, 2).join(' and ')} — these are required by your top matches`,
    `Complete an online certification in ${skills[0]} to strengthen your profile`,
    `Build a project using ${skills.slice(0, 2).join(', ')} to demonstrate practical knowledge`
  ],
  lowResume: [
    'Revamp your resume — add stronger action verbs and quantified results',
    'Include relevant project links and GitHub repositories',
    'Add a professional summary section highlighting your key strengths'
  ],
  lowMockInterviews: [
    'Complete at least 3 more mock interviews before applying',
    'Practice Data Structures and Algorithms problems daily',
    'Join peer interview groups on campus for regular practice'
  ],
  lowProjects: [
    'Build 1-2 more projects relevant to your target companies',
    'Contribute to open-source projects to demonstrate collaboration skills',
    'Create a portfolio website showcasing your best work'
  ],
  urgentDeadline: (company) => [
    `${company} deadline is approaching — finalize your application immediately`,
    `Prioritize ${company} application — submit within 24 hours`
  ],
  general: [
    'Keep your profile updated with latest skills and certifications',
    'Network with alumni placed in your target companies',
    'Attend upcoming placement preparation workshops'
  ]
};

/**
 * Generate action plan for a student based on analysis results.
 * @param {Object} student - student data
 * @param {Object} readinessResult - from Readiness Engine
 * @param {Array} matchResults - from Company Matcher
 * @param {Array} predictions - from Selection Predictor
 * @returns {Object} action plan with prioritized recommendations
 */
export function generateActionPlan(student, readinessResult, matchResults, predictions) {
  // === OBSERVE ===
  const studentId = student.id;
  const memory = getMemory(studentId);
  const { readinessScore, breakdown } = readinessResult;
  const actions = [];

  // === REASON ===

  // 1. CGPA-related actions
  if (breakdown.cgpa.score < 60) {
    const advice = pickFreshAdvice(studentId, ACTION_TEMPLATES.lowCGPA);
    if (advice) actions.push({ priority: 'medium', category: 'Academic', action: advice });
  }

  // 2. Missing skills from top-matching companies
  const allMissing = [...new Set(matchResults.flatMap(m => m.missingSkills || []))];
  if (allMissing.length > 0) {
    const skillAdvice = ACTION_TEMPLATES.missingSkills(allMissing);
    const advice = pickFreshAdvice(studentId, skillAdvice);
    if (advice) actions.push({ priority: 'high', category: 'Skills', action: advice });
  }

  // 3. Resume quality
  if (breakdown.resume.score < 50) {
    const advice = pickFreshAdvice(studentId, ACTION_TEMPLATES.lowResume);
    if (advice) actions.push({ priority: 'high', category: 'Resume', action: advice });
  }

  // 4. Mock interview count
  if (breakdown.mockInterviews.count < 3) {
    const advice = pickFreshAdvice(studentId, ACTION_TEMPLATES.lowMockInterviews);
    if (advice) actions.push({ priority: 'medium', category: 'Interview Prep', action: advice });
  }

  // 5. Project gaps
  if (breakdown.projects.count < 2 || breakdown.projects.avgRelevance < 60) {
    const advice = pickFreshAdvice(studentId, ACTION_TEMPLATES.lowProjects);
    if (advice) actions.push({ priority: 'medium', category: 'Projects', action: advice });
  }

  // 6. Urgent deadlines
  const urgentMatches = matchResults.filter(m => m.deadlineDays <= 3 && m.matchScore >= 30);
  urgentMatches.forEach(m => {
    const advice = ACTION_TEMPLATES.urgentDeadline(m.companyName)[0];
    actions.push({ priority: 'critical', category: 'Deadline', action: advice });
  });

  // 7. Always include one general action
  if (actions.length < 3) {
    const advice = pickFreshAdvice(studentId, ACTION_TEMPLATES.general);
    if (advice) actions.push({ priority: 'low', category: 'General', action: advice });
  }

  // === PLAN: Sort by priority ===
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  actions.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));

  // === ACT: Record in memory ===
  actions.forEach(a => recordAdvice(studentId, a.action));

  // === RETURN ===
  return {
    agent: 'ActionPlanner',
    studentId,
    readinessScore,
    totalActions: actions.length,
    actions,
    reasoning: `Generated ${actions.length} action items based on ${readinessScore}/100 readiness score.`
  };
}

/**
 * Pick advice that hasn't been given before (via memory layer).
 */
function pickFreshAdvice(studentId, options) {
  for (const option of options) {
    const key = option.substring(0, 30);
    if (!wasAdviceGiven(studentId, key)) {
      return option;
    }
  }
  return options[0]; // Fallback to first if all given
}
