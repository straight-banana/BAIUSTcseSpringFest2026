import { api } from "./api.js";

// Calls POST /api/ai/complete (backend/src/routes/aiRoutes.js), which is
// the ONLY way frontend code should reach an AI model — it keeps API keys
// server-side. Never call an AI provider's API directly from the browser.

/**
 * @param {string} prompt
 * @param {"custom"|"opensource"} [provider]
 * @param {object} [options]
 */
export async function aiComplete(prompt, provider = "custom", options = {}) {
  const { data } = await api.post("/ai/complete", { prompt, provider, options });
  return data; // { success, data: { text, provider, raw }, error, message }
}
