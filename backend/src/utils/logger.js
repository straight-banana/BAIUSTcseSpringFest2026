// Minimal logger. Swap for pino/winston later if you need structured logs
// or log shipping — the call sites (middleware/logger.js, errorHandler.js)
// won't need to change.
export const logger = {
  info: (...args) => console.log("[info]", ...args),
  warn: (...args) => console.warn("[warn]", ...args),
  error: (...args) => console.error("[error]", ...args),
};
