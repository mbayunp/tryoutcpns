const authService = require('../services/authService');
const response = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return response.success(res, user, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return response.success(res, data, 'Login successful', 200);
  } catch (err) {
    next(err);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await authService.profile(req.user.id);
    return response.success(res, user, 'Profile retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
};

const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.checkEmail(email);
    return response.success(res, null, 'Email terdaftar', 200);
  } catch (err) {
    next(err);
  }
};

const verifyPhone = async (req, res, next) => {
  try {
    const { email, phone_number } = req.body;
    await authService.verifyPhone(email, phone_number);
    return response.success(res, null, 'Nomor telepon cocok', 200);
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, phone_number, new_password } = req.body;
    await authService.resetPassword(email, phone_number, new_password);
    return response.success(res, null, 'Kata sandi berhasil diubah', 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  profile,
  checkEmail,
  verifyPhone,
  resetPassword
};
