const env = require('./env');

const getCorsOrigin = () => {
  if (env.CORS_ORIGIN === '*') {
    return true;
  }
  if (typeof env.CORS_ORIGIN === 'string' && env.CORS_ORIGIN.includes(',')) {
    return env.CORS_ORIGIN.split(',').map(o => o.trim());
  }
  return env.CORS_ORIGIN;
};

module.exports = {
  origin: getCorsOrigin(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
