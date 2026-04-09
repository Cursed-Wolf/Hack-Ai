// ============================================================
// PlaceIQ — Agent Memory Layer
// In-memory store for agent action history per student
// Enables personalized suggestions & avoids repeating advice
// ============================================================

// In-memory store (map of studentId → memory object)
const memoryStore = new Map();

/**
 * Initialize memory for a student (if not already present).
 */
export function initMemory(studentId, existingMemory = null) {
  if (!memoryStore.has(studentId)) {
    const defaults = {
      pastRecommendations: [],
      applicationHistory: [],
      previousWeaknesses: [],
      adviceGiven: []
    };
    memoryStore.set(studentId, { ...defaults, ...(existingMemory || {}) });
  }
}

/**
 * Get the memory context for a student.
 */
export function getMemory(studentId) {
  initMemory(studentId);
  return memoryStore.get(studentId);
}

/**
 * Record a new recommendation issued to the student.
 */
export function recordRecommendation(studentId, companyId, score) {
  initMemory(studentId);
  const mem = memoryStore.get(studentId);
  if (!mem.pastRecommendations.find(r => r.companyId === companyId)) {
    mem.pastRecommendations.push({ companyId, score, timestamp: new Date().toISOString() });
  }
}

/**
 * Record a weakness so the Planner knows not to repeat it.
 */
export function recordWeakness(studentId, weakness) {
  initMemory(studentId);
  const mem = memoryStore.get(studentId);
  if (!mem.previousWeaknesses.includes(weakness)) {
    mem.previousWeaknesses.push(weakness);
  }
}

/**
 * Record advice text to prevent circular advice.
 */
export function recordAdvice(studentId, adviceText) {
  initMemory(studentId);
  const mem = memoryStore.get(studentId);
  mem.adviceGiven.push({ text: adviceText, timestamp: new Date().toISOString() });
  // Keep only last 20 to prevent unbounded growth
  if (mem.adviceGiven.length > 20) {
    mem.adviceGiven = mem.adviceGiven.slice(-20);
  }
}

/**
 * Check if a specific advice has already been given.
 */
export function wasAdviceGiven(studentId, keyword) {
  initMemory(studentId);
  const mem = memoryStore.get(studentId);
  return mem.adviceGiven.some(a => a.text.toLowerCase().includes(keyword.toLowerCase()));
}
