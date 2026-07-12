import { aiRouter } from "../router/aiRouter.js";

// Base class for small-task classifiers (intent detection, tagging, routing).
export class BaseClassifier {
  constructor({ provider = "custom", labels = [] } = {}) {
    this.provider = provider;
    this.labels = labels;
  }

  async classify(text) {
    const prompt = `Classify the following text into one of: ${this.labels.join(
      ", "
    )}.\n\nText: ${text}\n\nRespond with only the label.`;
    return aiRouter.complete({ provider: this.provider, prompt });
  }
}
