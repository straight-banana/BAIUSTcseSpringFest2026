// Provider for a self-hosted / custom model server — e.g. Ollama, vLLM,
// LM Studio, or your own fine-tuned model behind a simple HTTP API.
// Configure the endpoint via CUSTOM_AI_API_URL (+ optional API key).
//
// Swap the fetch body/response parsing below to match whatever server
// you're pointing at — this is intentionally generic.
export const customProvider = {
  async complete(prompt, options = {}) {
    const url = process.env.CUSTOM_AI_API_URL;
    if (!url) throw new Error("CUSTOM_AI_API_URL is not set");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CUSTOM_AI_API_KEY && {
          Authorization: `Bearer ${process.env.CUSTOM_AI_API_KEY}`,
        }),
      },
      body: JSON.stringify({
        prompt,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 512,
        ...options,
      }),
    });

    if (!res.ok) {
      throw new Error(`Custom AI provider error: ${res.status} ${res.statusText}`);
    }

    const raw = await res.json();

    // Normalize to the shared AI response shape — adjust the field access
    // below to match your server's actual response shape.
    return {
      text: raw.response ?? raw.text ?? raw.output ?? "",
      provider: "custom",
      raw,
    };
  },
};
