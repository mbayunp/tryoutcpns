const { body } = require('express-validator');
const validate = require('./validate');

const updateEmailValidation = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
]);

module.exports = {
  updateEmailValidation
};
