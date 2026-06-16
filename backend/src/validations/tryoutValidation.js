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
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer in minutes'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive')
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
