const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');
const response = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 'Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return response.error(res, 'Unauthorized', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return response.error(res, 'Unauthorized', 401);
  }
};

module.exports = authMiddleware;
