const { body } = require('express-validator');
const validate = require('./validate');

const categoryValidation = validate([
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters')
]);

module.exports = {
  categoryValidation
};
