import { errorResponse } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";

// Last middleware in the chain (mounted in app.js). Anything passed to
// next(err) — including errors thrown inside asyncWrapper-wrapped routes —
// lands here instead of crashing the process or leaking a stack trace.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  logger.error(err);

  const status = err.status || 500;
  const message = status === 500 ? "Internal server error" : err.message;

  res.status(status).json(errorResponse(message));
}
