const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT || 3306,
    USER: process.env.DB_USER || 'root',
    PASS: process.env.DB_PASS || '',
    NAME: process.env.DB_NAME || 'wildan_tryout',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'supersecretcpnstryoutkey',
    EXPIRES: process.env.JWT_EXPIRES || '1d',
  },
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
