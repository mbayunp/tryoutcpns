const response = require('../utils/response');
const env = require('../config/env');

const errorMiddleware = (err, req, res, next) => {
  // If the error has a status code, use it. Otherwise default to 500
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error stack in development mode
  if (env.NODE_ENV === 'development') {
    console.error(`[Error] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  // Format error detail if available (e.g. from validation or custom errors)
  const errors = err.errors || null;

  return response.error(res, message, statusCode, errors);
};

module.exports = errorMiddleware;
