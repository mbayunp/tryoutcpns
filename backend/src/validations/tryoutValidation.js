const { body } = require('express-validator');
const validate = require('./validate');

const tryoutValidation = validate([
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Tryout title is required')
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('duration')
    .custom((value, { req }) => {
      const productType = req.body.product_type || 'TRYOUT';
      if (productType.toUpperCase() !== 'TRYOUT') {
        return true;
      }
      if (value === undefined || value === null || value === '' || isNaN(value) || parseInt(value) < 1) {
        throw new Error('Duration must be a positive integer in minutes');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
  body('category')
    .optional()
    .isIn(['Tryout', 'Kelas Online', 'E-Book', 'Bundling'])
    .withMessage('Category must be one of: Tryout, Kelas Online, E-Book, Bundling'),
  body('image_url')
    .optional({ nullable: true })
    .isString()
    .withMessage('Image URL must be a string'),
  body('original_price')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Original price must be a non-negative integer'),
  body('discount_percentage')
    .optional({ nullable: true })
    .isInt({ min: 0, max: 100 })
    .withMessage('Discount percentage must be an integer between 0 and 100'),
  body('price')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Price must be a non-negative integer')
]);

const startValidation = validate([
  body('tryout_id')
    .isInt()
    .withMessage('Tryout ID must be a valid integer')
]);

const submitValidation = validate([
  body('attempt_id')
    .isInt()
    .withMessage('Attempt ID must be a valid integer'),
  body('answers')
    .isArray()
    .withMessage('Answers must be an array of objects'),
  body('answers.*.question_id')
    .isInt()
    .withMessage('Each answer must have a valid question_id as integer'),
  body('answers.*.selected_answer')
    .optional({ nullable: true })
    .isIn(['a', 'b', 'c', 'd', 'e', 'A', 'B', 'C', 'D', 'E', '', null])
    .withMessage('Selected answer must be one of: a, b, c, d, e or null')
]);

module.exports = {
  tryoutValidation,
  startValidation,
  submitValidation
};
