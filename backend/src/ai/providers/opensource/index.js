// Provider for a hosted open-source model — e.g. Hugging Face Inference API,
// Together AI, Groq, Fireworks, OpenRouter, or any OpenAI-compatible endpoint
// serving an open-weight model (Llama, Mistral, Qwen, DeepSeek, etc).
// Configure via OPENSOURCE_AI_API_URL + OPENSOURCE_AI_API_KEY.
export const opensourceProvider = {
  async complete(prompt, options = {}) {
    const url = process.env.OPENSOURCE_AI_API_URL;
    const key = process.env.OPENSOURCE_AI_API_KEY;
    if (!url) throw new Error("OPENSOURCE_AI_API_URL is not set");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key && { Authorization: `Bearer ${key}` }),
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: options.temperature ?? 0.7,
          max_new_tokens: options.maxTokens ?? 512,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Open-source AI provider error: ${res.status} ${res.statusText}`);
    }

    const raw = await res.json();

    // Many hosted-open-source APIs return [{ generated_text }] — adjust
    // this normalization if your chosen provider's shape differs.
    const text = Array.isArray(raw) ? raw[0]?.generated_text : raw.generated_text ?? "";

    return { text: text ?? "", provider: "opensource", raw };
  },
};
