// Wrap every async controller with this in the route definition:
//   router.post("/", asyncWrapper(exampleController.create))
// so a rejected promise calls next(err) instead of hanging the request.
export function asyncWrapper(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
