'use strict';

function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message,
      }));
      return res.status(422).json({
        status: 'error',
        message: 'Validation failed',
        errors: messages,
      });
    }
    next();
  };
}

module.exports = { validateSchema };
