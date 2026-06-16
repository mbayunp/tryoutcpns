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

module.exports = {
  register,
  login,
  profile
};
