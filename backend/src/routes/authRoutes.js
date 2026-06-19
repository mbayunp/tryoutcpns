const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');
const {
  registerValidation,
  loginValidation,
  forgotPasswordCheckEmailValidation,
  forgotPasswordVerifyPhoneValidation,
  forgotPasswordResetValidation
} = require('../validations/authValidation');
// Rate limiting to prevent registration spam
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 registrations per 15 minutes per IP
  message: {
    status: 429,
    message: 'Terlalu banyak permintaan pembuatan akun dari alamat IP ini. Silakan coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', registerLimiter, registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', authMiddleware, authController.profile);

router.post('/forgot-password/check-email', forgotPasswordCheckEmailValidation, authController.checkEmail);
router.post('/forgot-password/verify-phone', forgotPasswordVerifyPhoneValidation, authController.verifyPhone);
router.post('/forgot-password/reset', forgotPasswordResetValidation, authController.forgotPasswordReset);

module.exports = router;
