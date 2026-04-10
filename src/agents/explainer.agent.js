// ============================================================
// PlaceIQ — Explainer Agent (Gemini-Powered)
// Makes ONE single Gemini call per analysis — efficient & fast
// Generates both overall assessment + per-match explanations
// ONLY generates text — NEVER modifies scores or rankings
// ============================================================

import {
  generateExplanation,
} from '../services/gemini.service.js';

/**
 * Generate ALL explanations in a SINGLE Gemini call.
 * This is efficient — one API call instead of 4-5.
 * 
 * @param {Object} student - student data
 * @param {Object} readiness - readiness score
 * @param {Array} rankedResults - ranked company results
 * @param {Array} predictions - prediction results
 * @param {Array} actionPlan - action items
 * @returns {Object} { overall, matchExplanations }
 */
export async function generateAllExplanations(student, readiness, rankedResults, predictions, actionPlan = []) {
  const topMatches = rankedResults.slice(0, 3);
  const topActions = (actionPlan || []).slice(0, 3).map(a => a.action).join('; ');

  // Build one comprehensive prompt
  const matchDetails = topMatches.map((m, i) => {
    const pred = predictions.find(p => p.companyId === m.companyId);
    return `  Match ${i + 1}: ${m.companyName} | Role: ${m.role} | CTC: ${m.ctc} | Score: ${m.matchScore}% | Probability: ${pred?.selectionProbability || 0}% | Tier: ${m.tier} | Matched Skills: ${m.overlappingSkills?.join(', ') || 'None'} | Missing: ${m.missingSkills?.join(', ') || 'None'} | CGPA Met: ${m.cgpaPassed ? 'Yes' : 'No'} | Deadline: ${m.deadlineDays} days`;
  }).join('\n');

  // Add a unique seed to ensure every response is different
  const uniqueSeed = `[Session: ${Date.now()}-${Math.random().toString(36).slice(2, 8)}]`;

  const prompt = `You are PlaceIQ, an AI placement intelligence advisor. Generate a UNIQUE and PERSONALIZED placement analysis report. ${uniqueSeed}

STUDENT: ${student.name} | Branch: ${student.branch} | CGPA: ${student.cgpa} | Sem: ${student.semester}
SKILLS: ${student.skills.join(', ')}
READINESS: ${readiness.readinessScore}/100
KEY ACTIONS: ${topActions}

TOP COMPANY MATCHES:
${matchDetails}

Generate output in EXACTLY this format (use ||| as separator):

OVERALL: [3-4 line personalized assessment covering readiness, top strength, improvement area, and motivation. Be specific about this student's actual skills and scores.]
|||
MATCH1: [2-3 line explanation for ${topMatches[0]?.companyName || 'Company 1'} — why good/bad fit + one specific action to improve chances]
|||
MATCH2: [2-3 line explanation for ${topMatches[1]?.companyName || 'Company 2'} — why good/bad fit + one specific action to improve chances]
|||
MATCH3: [2-3 line explanation for ${topMatches[2]?.companyName || 'Company 3'} — why good/bad fit + one specific action to improve chances]

RULES:
- Be specific about skills, not generic
- Be encouraging but honest
- Do NOT use markdown, bullets, or formatting
- Make each section unique and personalized for this student
- Reference actual skill names and scores
- Vary phrasing — never repeat sentence structures across matches`;

  console.log(`[Explainer] Generating explanations for ${student.name} (${student.id})`);
  const raw = await generateExplanation(prompt);
  console.log(`[Explainer] Raw response length: ${raw.length} chars`);

  // Parse the response
  const result = { overall: '', matchExplanations: {} };

  if (raw.includes('|||')) {
    const sections = raw.split('|||').map(s => s.trim());
    
    for (const section of sections) {
      if (section.startsWith('OVERALL:')) {
        result.overall = section.replace('OVERALL:', '').trim();
      } else if (section.startsWith('MATCH1:') && topMatches[0]) {
        result.matchExplanations[topMatches[0].companyId] = section.replace('MATCH1:', '').trim();
      } else if (section.startsWith('MATCH2:') && topMatches[1]) {
        result.matchExplanations[topMatches[1].companyId] = section.replace('MATCH2:', '').trim();
      } else if (section.startsWith('MATCH3:') && topMatches[2]) {
        result.matchExplanations[topMatches[2].companyId] = section.replace('MATCH3:', '').trim();
      }
    }

    // If OVERALL still empty, try alternative parsing (sometimes model skips prefix)
    if (!result.overall && sections.length > 0) {
      const firstSection = sections[0].trim();
      // Remove any leftover label
      result.overall = firstSection.replace(/^(OVERALL|Overall)[:\s]*/i, '').trim();
    }
  } else if (raw && raw !== 'AI assessment temporarily unavailable. Showing system-generated insights.') {
    // If format wasn't followed but we got real content, use it as overall
    result.overall = raw.replace(/^(OVERALL|Overall)[:\s]*/i, '').trim();
  }

  // Fallback if parsing missed the overall
  if (!result.overall && raw.length > 10) {
    result.overall = raw.split('\n').slice(0, 4).join(' ').trim();
  }

  // Final validation — if we still have just the fallback message, log it
  if (result.overall.includes('temporarily unavailable')) {
    console.warn('[Explainer] Gemini returned fallback — AI assessment will show fallback text');
  } else {
    console.log(`[Explainer] Successfully parsed: overall=${result.overall.length} chars, matches=${Object.keys(result.matchExplanations).length}`);
  }

  return result;
}
