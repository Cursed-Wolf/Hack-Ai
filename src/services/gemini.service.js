// ============================================================
// PlaceIQ — Gemini Service
// SINGLE CALL per analysis — fast, dynamic, no caching
// Uses gemini-2.0-flash for speed + availability
// ============================================================

import { GoogleGenerativeAI } from '@google/generative-ai';

// Use the new working API key — env var is secondary fallback
const NEW_API_KEY = 'AIzaSyCn9e6YPEWZi40k4kLdZ-SHhOo2LL0Q438';
const API_KEY = NEW_API_KEY;
const MODEL_NAME = 'gemini-2.0-flash';

let genAI = null;
let model = null;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 600,
      topP: 0.95,
    }
  });
  console.log(`[GeminiService] Ready — model: ${MODEL_NAME}, key: ${API_KEY.slice(0, 8)}...`);
} catch (err) {
  console.error('[GeminiService] Init failed:', err.message);
}

const FALLBACK = 'AI assessment temporarily unavailable. Showing system-generated insights.';

/**
 * Generate text from Gemini — ONE call, fast, with exponential backoff retry.
 */
export async function generateExplanation(prompt) {
  if (!model) {
    console.error('[Gemini] Model not initialized — returning fallback');
    return FALLBACK;
  }

  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Gemini] Attempt ${attempt}/${MAX_RETRIES} — sending prompt (${prompt.length} chars)`);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text()?.trim();
      
      if (!text) {
        console.warn('[Gemini] Empty response received');
        return FALLBACK;
      }
      
      console.log(`[Gemini] Success — received ${text.length} chars`);
      return text;
    } catch (err) {
      const errMsg = err.message || String(err);
      console.error(`[Gemini] Attempt ${attempt}/${MAX_RETRIES} failed:`, errMsg.substring(0, 120));
      
      // Retry on rate limits or server errors
      if (attempt < MAX_RETRIES && (errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('500') || errMsg.includes('RESOURCE_EXHAUSTED'))) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s exponential backoff
        console.warn(`[Gemini] Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      
      console.error(`[Gemini] Final failure — returning fallback. Error: ${errMsg.substring(0, 200)}`);
      return FALLBACK;
    }
  }
  return FALLBACK;
}
