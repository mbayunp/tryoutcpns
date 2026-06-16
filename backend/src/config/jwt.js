const env = require('./env');

module.exports = {
  secret: env.JWT.SECRET,
  expiresIn: env.JWT.EXPIRES
};
