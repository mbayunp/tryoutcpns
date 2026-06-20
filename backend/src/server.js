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
    
    try {
      await sequelize.sync(syncOptions);
      console.log('Database schemas synchronized successfully.');
    } catch (syncError) {
      if (syncOptions.alter) {
        console.warn('Database sync with alter failed, trying without alter:', syncError.message);
        await sequelize.sync({ force: false, alter: false });
        console.log('Database schemas synchronized successfully (fallback).');
      } else {
        throw syncError;
      }
    }

    // JWT Production Protection validation
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'supersecretcpnstryoutkey') {
        console.error('FATAL ERROR: JWT_SECRET is not configured or uses default insecure key in production!');
        process.exit(1);
      }
    }

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
