import { aiRouter } from "../ai/router/aiRouter.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// The AI "endpoint" for the whole app — POST /api/ai/complete.
// Frontend calls this via aiService.js. Keeps API keys server-side; never
// expose them to the client.
export async function complete(req, res) {
  const { prompt, provider = "custom", options = {} } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json(errorResponse("'prompt' (string) is required"));
  }

  try {
    const result = await aiRouter.complete({ provider, prompt, options });
    res.json(successResponse(result));
  } catch (err) {
    res.status(502).json(errorResponse(err.message));
  }
}
