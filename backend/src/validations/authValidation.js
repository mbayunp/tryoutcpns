const { body } = require('express-validator');
const validate = require('./validate');

const registerValidation = validate([
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Nomor telepon wajib diisi')
    .isLength({ min: 8, max: 20 })
    .withMessage('Nomor telepon harus antara 8 sampai 20 karakter'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user')
]);

const loginValidation = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]);

const forgotPasswordCheckEmailValidation = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak valid')
]);

const forgotPasswordVerifyPhoneValidation = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak valid'),
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Nomor telepon wajib diisi')
]);

const forgotPasswordResetValidation = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email wajib diisi')
    .isEmail()
    .withMessage('Format email tidak valid'),
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Nomor telepon wajib diisi'),
  body('new_password')
    .notEmpty()
    .withMessage('Kata sandi baru wajib diisi')
    .isLength({ min: 6 })
    .withMessage('Kata sandi baru minimal 6 karakter')
]);

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordCheckEmailValidation,
  forgotPasswordVerifyPhoneValidation,
  forgotPasswordResetValidation
};
