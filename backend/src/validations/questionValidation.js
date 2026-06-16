const { body } = require('express-validator');
const validate = require('./validate');

const questionValidation = validate([
  body('tryout_id')
    .isInt()
    .withMessage('Tryout ID must be an integer'),
  body('category_id')
    .isInt()
    .withMessage('Category ID must be an integer'),
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),
  body('option_a')
    .trim()
    .notEmpty()
    .withMessage('Option A is required'),
  body('option_b')
    .trim()
    .notEmpty()
    .withMessage('Option B is required'),
  body('option_c')
    .trim()
    .notEmpty()
    .withMessage('Option C is required'),
  body('option_d')
    .trim()
    .notEmpty()
    .withMessage('Option D is required'),
  body('option_e')
    .trim()
    .notEmpty()
    .withMessage('Option E is required'),
  body('correct_answer')
    .trim()
    .notEmpty()
    .withMessage('Correct answer is required')
    .isIn(['a', 'b', 'c', 'd', 'e', 'A', 'B', 'C', 'D', 'E'])
    .withMessage('Correct answer must be one of: a, b, c, d, e'),
  body('option_weights')
    .optional()
    .custom((value) => {
      if (typeof value === 'object' && value !== null) {
        // Validate keys and integer values
        const keys = Object.keys(value);
        for (let key of keys) {
          if (!['a', 'b', 'c', 'd', 'e'].includes(key.toLowerCase())) {
            throw new Error('Option weights keys must be a, b, c, d, or e');
          }
          if (typeof value[key] !== 'number' || value[key] < 0 || value[key] > 5) {
            throw new Error('Option weights values must be numbers between 0 and 5');
          }
        }
      }
      return true;
    })
]);

module.exports = {
  questionValidation
};
