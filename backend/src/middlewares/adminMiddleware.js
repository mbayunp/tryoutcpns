const response = require('../utils/response');

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return response.error(res, 'Forbidden: Admin access required', 403);
  }
};

module.exports = adminMiddleware;
