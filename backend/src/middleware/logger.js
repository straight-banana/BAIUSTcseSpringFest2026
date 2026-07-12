import { logger } from "../utils/logger.js";

// Minimal request logger. Swap for morgan if you want more detail/format
// options — this exists so app.js has somewhere to mount request logging
// without pulling in a dependency by default.
export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
}
