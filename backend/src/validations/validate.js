const { validationResult } = require('express-validator');
const response = require('../utils/response');

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return response.error(
      res, 
      'Validation Error', 
      400, 
      errors.array().map(err => ({ field: err.path, message: err.msg }))
    );
  };
};

module.exports = validate;
