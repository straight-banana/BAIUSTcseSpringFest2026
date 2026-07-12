# AI Request / Response Contract

All AI calls go through `backend/src/ai/router/aiRouter.js`, reached via
`POST /api/ai/complete` (auth-gated, see `contracts/api.md`). Application
code (frontend, agents, classifiers) must never call a provider directly,
and the frontend must never hold an AI provider API key.

## Providers

| Key          | Use case                                                        |
|--------------|-------------------------------------------------------------------|
| `custom`     | Self-hosted / your own model server (Ollama, vLLM, LM Studio, fine-tuned endpoint) |
| `opensource` | Hosted open-weight model via an inference API (Hugging Face Inference API, Together, Groq, OpenRouter, etc.) |

Configure endpoints via `backend/.env` (local) or your host's secret
manager (production) — see `backend/.env.example`.

## Request Shape (frontend → `POST /api/ai/complete`)

```ts
{
  prompt: string;
  provider?: "custom" | "opensource"; // default "custom"
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}
```

## Response Shape

```ts
{
  success: boolean;
  data: {
    text: string;
    provider: string;
    raw?: unknown; // original provider response, for debugging
  } | null;
  error: string | null;
  message: string | null;
}
```

## Adding a New Provider

1. Create `backend/src/ai/providers/<name>/index.js`
2. Export an object with an async `complete(prompt, options)` method that
   returns `{ text, provider, raw }`
3. Register it in `aiRouter.js`'s `providers` map
4. Never call it directly from the frontend or from agents/classifiers —
   always via `aiRouter`

## Agents & Classifiers

- `backend/src/ai/agents` — multi-step orchestration built on `aiRouter`
- `backend/src/ai/classifiers` — single-shot classification tasks
- Both call the router, never a provider module, so switching models is a
  one-line config change (`provider: "custom"` → `"opensource"`, or point
  `CUSTOM_AI_API_URL` at a different server).
