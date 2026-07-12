import { customProvider } from "../providers/custom/index.js";
import { opensourceProvider } from "../providers/opensource/index.js";

// Application code (agents/classifiers/controllers) should NEVER call a
// provider directly — always go through this router so the model backing
// the app can be swapped with a one-line config change.
const providers = {
  custom: customProvider,
  opensource: opensourceProvider,
};

export const aiRouter = {
  /**
   * @param {Object} opts
   * @param {"custom"|"opensource"} opts.provider
   * @param {string} opts.prompt
   * @param {Object} [opts.options]
   */
  async complete({ provider = "custom", prompt, options = {} }) {
    const impl = providers[provider];
    if (!impl) throw new Error(`Unknown AI provider: ${provider}`);
    return impl.complete(prompt, options);
  },
};
