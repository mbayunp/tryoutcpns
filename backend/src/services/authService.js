const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');

const register = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'user',
    is_active: true
  });

  // Remove password from response
  const userResponse = newUser.toJSON();
  delete userResponse.password;

  return userResponse;
};

const login = async (email, password) => {
  console.log('Login attempt debug - Email:', email, 'Password:', password ? `[exists, length: ${password.length}]` : '[missing]');
  const user = await User.findOne({ where: { email } });
  if (!user || !user.is_active) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  const userResponse = user.toJSON();
  delete userResponse.password;

  return {
    user: userResponse,
    token
  };
};

const profile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user || !user.is_active) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const userResponse = user.toJSON();
  delete userResponse.password;

  return userResponse;
};

module.exports = {
  register,
  login,
  profile
};
