const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  registerValidation,
  loginValidation,
  forgotPasswordCheckEmailValidation,
  forgotPasswordVerifyPhoneValidation,
  forgotPasswordResetValidation
} = require('../validations/authValidation');

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', authMiddleware, authController.profile);

router.post('/forgot-password/check-email', forgotPasswordCheckEmailValidation, authController.checkEmail);
router.post('/forgot-password/verify-phone', forgotPasswordVerifyPhoneValidation, authController.verifyPhone);
router.post('/forgot-password/reset', forgotPasswordResetValidation, authController.resetPassword);

module.exports = router;
