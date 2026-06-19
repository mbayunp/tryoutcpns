const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');
const { verifyGoogleToken } = require('../utils/googleAuth');
const { sendResetPasswordEmail } = require('../utils/mailer');

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

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Email tidak terdaftar');
    error.statusCode = 404;
    throw error;
  }

  // Create reset token signed with current password as secret
  const secret = jwtConfig.secret + user.password;
  const token = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: '15m' } // Expires in 15 minutes
  );

  await sendResetPasswordEmail(user.email, user.name, token);
  return true;
};

const resetPassword = async (token, newPassword) => {
  if (!token) {
    const error = new Error('Token atur ulang kata sandi diperlukan');
    error.statusCode = 400;
    throw error;
  }

  // Decode first to get user email and id
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.email) {
    const error = new Error('Tautan tidak valid');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { email: decoded.email } });
  if (!user) {
    const error = new Error('Pengguna tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  // Verify signature using user's password hash in the secret
  const secret = jwtConfig.secret + user.password;
  try {
    jwt.verify(token, secret);
  } catch (err) {
    const error = new Error('Tautan telah kedaluwarsa atau tidak valid');
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

const googleLogin = async (idToken) => {
  let googleUser;
  try {
    googleUser = await verifyGoogleToken(idToken);
  } catch (err) {
    console.error('Google ID token verification failed:', err);
    const error = new Error('Verifikasi login Google gagal: ' + err.message);
    error.statusCode = 400;
    throw error;
  }

  const { email, name } = googleUser;
  if (!email) {
    const error = new Error('Email tidak diterima dari akun Google Anda');
    error.statusCode = 400;
    throw error;
  }

  let user = await User.findOne({ where: { email } });
  if (!user) {
    // Create new user with a secure random password
    const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-10);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user = await User.create({
      name: name || 'Pengguna Google',
      email,
      password: hashedPassword,
      role: 'user',
      is_active: true
    });
  } else if (!user.is_active) {
    const error = new Error('Akun dinonaktifkan oleh administrator');
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

module.exports = {
  register,
  login,
  profile,
  forgotPassword,
  resetPassword,
  googleLogin
};
