// ============================================================
// PlaceIQ — Gemini Service
// SINGLE CALL per analysis — fast, dynamic, no caching
// Uses gemini-2.5-flash-lite for speed + availability
// ============================================================

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDJMpkxjYo_nwlbyNpZtGiVwcIYqLo9nn0';
const MODEL_NAME = 'gemini-2.5-flash-lite';

let genAI = null;
let model = null;

try {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 400,
      topP: 0.9,
    }
  });
  console.log(`[GeminiService] Ready — model: ${MODEL_NAME}`);
} catch (err) {
  console.warn('[GeminiService] Init failed:', err.message);
}

const FALLBACK = 'AI assessment temporarily unavailable. Showing system-generated insights.';

/**
 * Generate text from Gemini — ONE call, fast, with single retry.
 */
export async function generateExplanation(prompt) {
  if (!model) return FALLBACK;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim();
      return text || FALLBACK;
    } catch (err) {
      if (attempt < 2 && (err.message?.includes('429') || err.message?.includes('503'))) {
        console.warn(`[Gemini] Retry ${attempt}/2...`);
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      console.warn(`[Gemini] Failed:`, err.message?.substring(0, 80));
      return FALLBACK;
    }
  }
  return FALLBACK;
}
