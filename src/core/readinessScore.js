// ============================================================
// PlaceIQ — Readiness Score Engine
// Computes a 0–100 score per student based on deterministic factors
// ============================================================

const WEIGHTS = {
  cgpa: 0.25,          // out of 10, normalized to 100
  skillMatch: 0.25,    // how many in-demand skills they have
  resumeScore: 0.20,   // pre-computed resume quality score
  mockInterviews: 0.15, // practice count
  projectRelevance: 0.15 // average project relevance
};

// Skills that are broadly in-demand across the industry
const HIGH_DEMAND_SKILLS = [
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL',
  'AWS', 'Docker', 'TypeScript', 'Machine Learning', 'Git', 'Linux'
];

/**
 * Compute the readiness score for a single student.
 * @param {Object} student - student data object from mockData
 * @returns {{ readinessScore, breakdown }}
 */
export function computeReadinessScore(student) {
  // 1. CGPA factor (normalized to 0-100)
  const cgpaScore = Math.min((student.cgpa / 10) * 100, 100);

  // 2. Skill match — % of high-demand skills the student possesses
  const matchedSkills = student.skills.filter(s => HIGH_DEMAND_SKILLS.includes(s));
  const skillScore = Math.min((matchedSkills.length / 5) * 100, 100); // 5+ in-demand skills = 100

  // 3. Resume quality (already a 0-100 value)
  const resumeScore = student.resumeScore;

  // 4. Mock interviews (cap at 8 for normalization)
  const mockScore = Math.min((student.mockInterviews / 8) * 100, 100);

  // 5. Project relevance (average relevance of their projects)
  const projectScores = student.projects.map(p => p.relevance);
  const projectScore = projectScores.length > 0
    ? projectScores.reduce((a, b) => a + b, 0) / projectScores.length
    : 0;

  // Weighted total
  const readinessScore = Math.round(
    (cgpaScore * WEIGHTS.cgpa) +
    (skillScore * WEIGHTS.skillMatch) +
    (resumeScore * WEIGHTS.resumeScore) +
    (mockScore * WEIGHTS.mockInterviews) +
    (projectScore * WEIGHTS.projectRelevance)
  );

  return {
    readinessScore: Math.min(readinessScore, 100),
    breakdown: {
      cgpa: { raw: student.cgpa, score: Math.round(cgpaScore) },
      skills: { matched: matchedSkills, count: matchedSkills.length, score: Math.round(skillScore) },
      resume: { score: resumeScore },
      mockInterviews: { count: student.mockInterviews, score: Math.round(mockScore) },
      projects: { count: student.projects.length, avgRelevance: Math.round(projectScore) }
    }
  };
}
