// ============================================================
// PlaceIQ — Selection Predictor Agent
// OBSERVE → REASON → PLAN → ACT → RETURN
// Focus: Contextual modification of match rates using constraints
// ============================================================

/**
 * Predict selection probability based on match + contextual modifiers.
 * This agent augments the raw match score from Company Matcher with
 * historical boundary enforcement and contextual factors.
 *
 * @param {Object} student - student data
 * @param {Object} matchResult - output from Company Matcher
 * @returns {Object} prediction with probability and reasoning
 */
export function predictSelection(student, matchResult) {
  // === OBSERVE ===
  const { matchScore, cgpaPassed, overlappingSkills, missingSkills, companyName, batch } = matchResult;
  const cgpa = student.cgpa || 0;
  const mockInterviews = student.mockInterviews || 0;
  const resumeScore = student.resumeScore || 0;

  // === REASON ===
  let probability = matchScore; // Start from match score as baseline
  const modifiers = [];

  // 1. CGPA hard gate — if not passed, flatline probability
  if (!cgpaPassed) {
    probability = Math.min(probability, 15); // Cap at 15%
    modifiers.push('CGPA below company minimum — probability capped');
  }

  // 2. Tier-based competition modifier
  if (batch === 'Tier 1') {
    probability = Math.round(probability * 0.75); // Tier 1 = more competitive
    modifiers.push('Tier 1 company — higher competition factor applied');
  } else if (batch === 'Tier 3') {
    probability = Math.round(probability * 1.15); // Tier 3 = less competitive
    modifiers.push('Tier 3 company — lower competition, probability boosted');
  }

  // 3. Mock interview readiness
  if (mockInterviews >= 5) {
    probability = Math.min(probability + 8, 100);
    modifiers.push('Strong mock interview practice (+8%)');
  } else if (mockInterviews <= 1) {
    probability = Math.max(probability - 5, 0);
    modifiers.push('Very few mock interviews (-5%)');
  }

  // 4. Resume quality gate
  if (resumeScore < 40) {
    probability = Math.max(probability - 10, 0);
    modifiers.push('Low resume quality — shortlisting risk (-10%)');
  } else if (resumeScore >= 80) {
    probability = Math.min(probability + 5, 100);
    modifiers.push('Strong resume quality (+5%)');
  }

  // 5. Skill coverage bonus
  const totalRequired = (overlappingSkills?.length || 0) + (missingSkills?.length || 0);
  const coverageRatio = totalRequired > 0 ? (overlappingSkills?.length || 0) / totalRequired : 0;
  if (coverageRatio >= 0.8) {
    probability = Math.min(probability + 7, 100);
    modifiers.push('Excellent skill coverage (≥80%)');
  }

  // === PLAN + ACT + RETURN ===
  probability = Math.max(0, Math.min(100, Math.round(probability)));

  let confidence;
  if (probability >= 70) confidence = 'High';
  else if (probability >= 40) confidence = 'Medium';
  else confidence = 'Low';

  return {
    agent: 'SelectionPredictor',
    companyId: matchResult.companyId,
    companyName,
    selectionProbability: probability,
    confidence,
    modifiers,
    reasoning: `Base match ${matchScore}% adjusted to ${probability}% after ${modifiers.length} contextual modifiers.`
  };
}
