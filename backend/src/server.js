const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync database schema (in dev mode we can use alter: true or force: false)
    // Synchronize structures with safety
    const syncOptions = {
      alter: env.NODE_ENV === 'development',
      force: false
    };
    
    await sequelize.sync(syncOptions);
    console.log('Database schemas synchronized successfully.');

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
    process.exit(1);
  }
};

startServer();
