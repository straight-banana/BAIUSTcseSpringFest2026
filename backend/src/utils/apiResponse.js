// Same envelope shape as before, just returned from callable functions
// instead of Express routes. Keeps the frontend contract identical
// regardless of which transport is behind it.
export function successResponse(data = null, message = null) {
  return { success: true, data, error: null, message };
}

export function errorResponse(error = "Something went wrong", message = null) {
  return { success: false, data: null, error, message };
}
