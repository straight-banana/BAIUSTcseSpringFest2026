import { errorResponse } from "../utils/apiResponse.js";

// Runs a Zod schema (from src/validators/*) against req.body. On failure,
// responds 400 with the first validation issue instead of reaching the
// controller at all.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issue = result.error.issues[0];
      return res.status(400).json(errorResponse(`${issue.path.join(".")}: ${issue.message}`));
    }
    req.body = result.data;
    next();
  };
}
