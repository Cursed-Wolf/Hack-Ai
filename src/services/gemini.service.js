// ============================================================
// PlaceIQ — Gemini Service
// SINGLE CALL per analysis — fast, dynamic, no caching
// Uses gemini-2.0-flash for speed + availability
// ============================================================

import { GoogleGenerativeAI } from '@google/generative-ai';

// Use the new working API key — env var is secondary fallback
const NEW_API_KEY = 'AIzaSyCn9e6YPEWZi40k4kLdZ-SHhOo2LL0Q438';
const API_KEY = NEW_API_KEY;

// List of models to cycle through if quota is hit
const FALLBACK_MODELS = [
  'gemini-3.1-flash-lite-preview',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
  'gemini-2.0-flash'
];

let genAI = null;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
  console.log(`[GeminiService] Ready — key: ${API_KEY.slice(0, 8)}...`);
} catch (err) {
  console.error('[GeminiService] Init failed:', err.message);
}

const FALLBACK = 'AI assessment temporarily unavailable. Showing system-generated insights.';

export let lastGeminiError = null;

function getModelInstance(modelName) {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 600,
      topP: 0.95,
    }
  });
}

/**
 * Generate text from Gemini — ONE call, fast, with robust model fallback & retries.
 */
export async function generateExplanation(prompt) {
  if (!genAI) {
    console.error('[Gemini] GenAI not initialized — returning fallback');
    return FALLBACK;
  }

  // Iterate over multiple models sequentially
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`[Gemini] Attempting generation with model: ${modelName} (${prompt.length} chars)`);
      const model = getModelInstance(modelName);
      const result = await model.generateContent(prompt);
      const text = result.response?.text()?.trim();
      
      if (!text) {
        console.warn(`[Gemini] Empty response from ${modelName}`);
        lastGeminiError = `Empty response from ${modelName}`;
        continue; // Try next model
      }
      
      console.log(`[Gemini] Success using ${modelName} — received ${text.length} chars`);
      lastGeminiError = null;
      return text;
    } catch (err) {
      const errMsg = err.message || String(err);
      console.error(`[Gemini] Model ${modelName} failed:`, errMsg.substring(0, 120));
      lastGeminiError = errMsg;
      
      // If it's a quota issue or unrecognised model, just try the next model
      if (errMsg.includes('429') || errMsg.includes('404') || errMsg.includes('403') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        console.warn(`[Gemini] Quota/Access issue for ${modelName}, switching to next fallback model...`);
        continue; 
      }
      
      // For general 500/503 network errors, do one quick retry on the same model
      if (errMsg.includes('503') || errMsg.includes('500')) {
        try {
          await new Promise(r => setTimeout(r, 1000));
          const retryModel = getModelInstance(modelName);
          const retryResult = await retryModel.generateContent(prompt);
          if (retryResult.response?.text()) {
             return retryResult.response.text().trim();
          }
        } catch (retryErr) {}
      }
    }
  }
  
  console.error(`[Gemini] Final failure — all fallback models exhausted or errored.`);
  return FALLBACK;
}
