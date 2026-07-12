import { aiRouter } from "../router/aiRouter.js";

// Base class for higher-level agent orchestration on top of the AI Router.
export class BaseAgent {
  constructor({ provider = "custom", systemPrompt = "" } = {}) {
    this.provider = provider;
    this.systemPrompt = systemPrompt;
  }

  async run(input) {
    return aiRouter.complete({
      provider: this.provider,
      prompt: `${this.systemPrompt}\n\n${input}`,
    });
  }
}
