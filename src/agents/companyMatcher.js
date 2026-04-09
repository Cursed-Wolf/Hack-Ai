// ============================================================
// PlaceIQ — Company Matcher Agent
// OBSERVE → REASON → PLAN → ACT → RETURN
// Focus: Jaccard Similarity + CGPA gating for demand vs supply
// ============================================================

/**
 * Compute Jaccard Similarity between two skill arrays.
 * |Intersection| / |Union|
 */
function jaccardSimilarity(studentSkills, companySkills) {
  const sSet = new Set(studentSkills.map(s => s.toLowerCase()));
  const cSet = new Set(companySkills.map(s => s.toLowerCase()));

  const intersection = [...sSet].filter(s => cSet.has(s));
  const union = new Set([...sSet, ...cSet]);

  return union.size === 0 ? 0 : intersection.length / union.size;
}

/**
 * Match a student against a single company.
 * @param {Object} student - student data
 * @param {Object} company - company data
 * @returns {Object} match result with score and reasoning
 */
export function matchStudentToCompany(student, company) {
  // === OBSERVE ===
  const studentSkills = student.skills || [];
  const companySkills = company.requiredSkills || [];
  const studentCGPA = student.cgpa || 0;
  const minCGPA = company.minCGPA || 0;

  // === REASON ===
  // Step 1: CGPA Gate — hard constraint check
  const cgpaPassed = studentCGPA >= minCGPA;

  // Step 2: Jaccard skill similarity
  const rawSimilarity = jaccardSimilarity(studentSkills, companySkills);

  // Step 3: Direct skill overlap count
  const sLower = studentSkills.map(s => s.toLowerCase());
  const cLower = companySkills.map(s => s.toLowerCase());
  const overlappingSkills = cLower.filter(s => sLower.includes(s));
  const missingSkills = cLower.filter(s => !sLower.includes(s));

  // === PLAN ===
  // Compute match score (0-100)
  let matchScore;
  if (!cgpaPassed) {
    // Penalize heavily but don't zero-out (student may still barely qualify)
    matchScore = Math.round(rawSimilarity * 100 * 0.3); // 70% penalty
  } else {
    matchScore = Math.round(rawSimilarity * 100);
  }

  // Bonus for direct skill overlap percentage
  const overlapRatio = companySkills.length > 0
    ? overlappingSkills.length / companySkills.length
    : 0;

  // Blend: 60% Jaccard + 40% direct overlap ratio
  matchScore = Math.round(matchScore * 0.6 + (overlapRatio * 100) * 0.4);
  matchScore = Math.min(matchScore, 100);

  // === ACT + RETURN ===
  return {
    agent: 'CompanyMatcher',
    companyId: company.id,
    companyName: company.name,
    role: company.role,
    ctc: company.ctc,
    batch: company.batch,
    deadline: company.deadline,
    deadlineDays: company.deadlineDays,
    matchScore,
    cgpaPassed,
    overlappingSkills,
    missingSkills,
    reasoning: cgpaPassed
      ? `${overlappingSkills.length}/${companySkills.length} required skills matched (Jaccard: ${(rawSimilarity * 100).toFixed(1)}%)`
      : `CGPA ${studentCGPA} below minimum ${minCGPA}. Skill match: ${overlappingSkills.length}/${companySkills.length}`
  };
}

/**
 * Match a student against ALL companies.
 */
export function matchStudentToAllCompanies(student, companies) {
  return companies.map(c => matchStudentToCompany(student, c));
}
