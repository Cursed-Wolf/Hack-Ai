// ============================================================
// PlaceIQ — Resume Analyzer Agent
// OBSERVE → REASON → PLAN → ACT → RETURN
// Focus: Extraction and Structuring of resume data
// ============================================================

// Keyword dictionaries for heuristic extraction
const SKILL_KEYWORDS = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Node.js', 'Express',
  'MongoDB', 'SQL', 'PostgreSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
  'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot',
  'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science', 'R',
  'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'GraphQL', 'Redis', 'Kafka', 'CI/CD', 'Git', 'Linux',
  'Figma', 'UI/UX', 'Tailwind CSS', 'HTML', 'CSS', 'SASS',
  'REST API', 'Microservices', 'Agile', 'Scrum'
];

const ACTION_VERBS = [
  'developed', 'built', 'designed', 'implemented', 'created',
  'led', 'managed', 'optimized', 'improved', 'deployed',
  'architected', 'integrated', 'automated', 'launched'
];

/**
 * Analyze a resume text and extract structured data.
 * Follows the OBSERVE → REASON → PLAN → ACT → RETURN loop.
 *
 * @param {string} resumeText - raw resume string
 * @returns {Object} structured analysis
 */
export function analyzeResume(resumeText) {
  // === OBSERVE ===
  const text = resumeText || '';
  const lowerText = text.toLowerCase();

  // === REASON ===
  // Extract skills by keyword matching
  const detectedSkills = SKILL_KEYWORDS.filter(skill =>
    lowerText.includes(skill.toLowerCase())
  );

  // Extract CGPA via regex
  const cgpaMatch = text.match(/CGPA[:\s]*(\d+\.?\d*)/i) ||
                    text.match(/GPA[:\s]*(\d+\.?\d*)/i);
  const cgpa = cgpaMatch ? parseFloat(cgpaMatch[1]) : null;

  // Count action verbs (indicator of strong resume language)
  const actionVerbCount = ACTION_VERBS.filter(v =>
    lowerText.includes(v)
  ).length;

  // Estimate section completeness
  const hasSections = {
    skills: lowerText.includes('skill'),
    projects: lowerText.includes('project'),
    experience: lowerText.includes('experience') || lowerText.includes('intern'),
    education: lowerText.includes('education') || lowerText.includes('cgpa') || lowerText.includes('university'),
    objective: lowerText.includes('objective') || lowerText.includes('summary')
  };

  const sectionCount = Object.values(hasSections).filter(Boolean).length;

  // === PLAN ===
  // Compute resume quality score (0–100)
  let qualityScore = 0;
  qualityScore += Math.min(detectedSkills.length * 8, 30);  // up to 30 for skills
  qualityScore += cgpa ? 15 : 0;                              // 15 for having CGPA
  qualityScore += Math.min(actionVerbCount * 5, 20);          // up to 20 for strong verbs
  qualityScore += sectionCount * 7;                            // up to 35 for sections

  // Identify weaknesses
  const weaknesses = [];
  if (detectedSkills.length < 3) weaknesses.push('Too few technical skills listed');
  if (!cgpa) weaknesses.push('CGPA not mentioned');
  if (actionVerbCount < 2) weaknesses.push('Weak action verbs — use stronger language');
  if (!hasSections.projects) weaknesses.push('No projects section found');
  if (!hasSections.experience) weaknesses.push('No experience/internship section');
  if (text.length < 200) weaknesses.push('Resume too short — add more detail');

  // === ACT + RETURN ===
  return {
    agent: 'ResumeAnalyzer',
    status: 'complete',
    extractedData: {
      skills: detectedSkills,
      cgpa,
      actionVerbCount,
      sections: hasSections,
      sectionCount,
      wordCount: text.split(/\s+/).length
    },
    qualityScore: Math.min(qualityScore, 100),
    weaknesses,
    reasoning: `Detected ${detectedSkills.length} skills, ${actionVerbCount} action verbs, and ${sectionCount}/5 key sections.`
  };
}
