const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Add referral_code column to transactions safely
    try {
      await sequelize.query("ALTER TABLE `transactions` ADD COLUMN `referral_code` VARCHAR(50) DEFAULT NULL;");
      console.log('Added referral_code column to transactions table.');
    } catch (err) {
      // Ignore if column already exists
    }

    // Sync database schema
    const syncOptions = {
      alter: false,
      force: false
    };
    
    try {
      await sequelize.sync(syncOptions);
      console.log('Database schemas synchronized successfully.');
    } catch (syncError) {
      throw syncError;
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
