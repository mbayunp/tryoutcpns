const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');

const register = async (userData) => {
  const { name, email, password, role, phone_number } = userData;

  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email sudah terdaftar');
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
    phone_number,
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

const normalizePhone = (phone) => {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, ''); // keep only digits
  if (clean.startsWith('62')) {
    clean = '0' + clean.slice(2);
  }
  return clean;
};

const checkEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Email tidak terdaftar');
    error.statusCode = 404;
    throw error;
  }
  return true;
};

const verifyPhone = async (email, phone_number) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Email tidak terdaftar');
    error.statusCode = 404;
    throw error;
  }

  const normUserPhone = normalizePhone(user.phone_number);
  const normInputPhone = normalizePhone(phone_number);

  if (!user.phone_number || normUserPhone !== normInputPhone) {
    const error = new Error('Nomor telepon konfirmasi salah');
    error.statusCode = 400;
    throw error;
  }
  return true;
};

const resetPassword = async (email, phone_number, newPassword) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Email tidak terdaftar');
    error.statusCode = 404;
    throw error;
  }

  const normUserPhone = normalizePhone(user.phone_number);
  const normInputPhone = normalizePhone(phone_number);

  if (!user.phone_number || normUserPhone !== normInputPhone) {
    const error = new Error('Nomor telepon konfirmasi salah');
    error.statusCode = 400;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return true;
};

module.exports = {
  register,
  login,
  profile,
  checkEmail,
  verifyPhone,
  resetPassword
};
