import { verifyAccessToken } from "../utils/tokens.js";
import { errorResponse } from "../utils/apiResponse.js";

// Verifies the `Authorization: Bearer <token>` header and attaches the
// decoded payload to req.user. Every protected route mounts this first —
// controllers can assume req.user exists once it's passed.
export function auth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json(errorResponse("Missing or malformed Authorization header"));
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json(errorResponse("Invalid or expired token"));
  }
}
