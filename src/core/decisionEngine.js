// ============================================================
// PlaceIQ — Decision Engine Layer
// Formula: Final = (Match × 0.5) + (Prediction × 0.3) + (Urgency × 0.2)
// ============================================================

/**
 * Compute deadline urgency score (0–100).
 * Closer deadlines → higher urgency.
 */
export function computeDeadlineUrgency(deadlineDays) {
  if (deadlineDays <= 0) return 100;
  if (deadlineDays <= 1) return 95;
  if (deadlineDays <= 3) return 85;
  if (deadlineDays <= 7) return 65;
  if (deadlineDays <= 14) return 40;
  if (deadlineDays <= 21) return 20;
  return 10;
}

/**
 * Core Decision Engine — deterministic weighted scoring.
 * @param {number} matchScore       - 0 to 100 from Company Matcher
 * @param {number} selectionProb    - 0 to 100 from Selection Predictor
 * @param {number} deadlineDays     - days until company deadline
 * @returns {{ finalScore, matchScore, selectionProb, urgencyScore, tier }}
 */
export function computeFinalScore(matchScore, selectionProb, deadlineDays) {
  const urgencyScore = computeDeadlineUrgency(deadlineDays);

  const finalScore = Math.round(
    (matchScore * 0.5) +
    (selectionProb * 0.3) +
    (urgencyScore * 0.2)
  );

  // Classify into tiers for the dashboard
  let tier;
  if (finalScore >= 70) tier = 'Reach';
  else if (finalScore >= 45) tier = 'Match';
  else tier = 'Safety';

  return {
    finalScore: Math.min(finalScore, 100),
    matchScore,
    selectionProb,
    urgencyScore,
    tier
  };
}

/**
 * Rank a list of company results by finalScore descending.
 */
export function rankResults(results) {
  return [...results].sort((a, b) => b.finalScore - a.finalScore);
}
