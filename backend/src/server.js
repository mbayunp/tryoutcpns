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

    // Add PPPK columns and alter table schemas safely
    try {
      await sequelize.query("ALTER TABLE `questions` ADD COLUMN `options_weights` JSON DEFAULT NULL;");
      console.log('Added options_weights column to questions table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `questions` ADD COLUMN `scoring_type` ENUM('BINARY', 'WEIGHTED_1_5', 'WEIGHTED_1_4') NOT NULL DEFAULT 'BINARY';");
      console.log('Added scoring_type column to questions table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `questions` ADD COLUMN `sub_category` VARCHAR(100) DEFAULT NULL;");
      console.log('Added sub_category column to questions table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `questions` MODIFY COLUMN `correct_answer` VARCHAR(5) DEFAULT NULL;");
      console.log('Modified correct_answer column to be nullable in questions table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `questions` MODIFY COLUMN `program_type` ENUM('PPG', 'PPPK', 'SKD') NOT NULL DEFAULT 'SKD';");
      console.log('Updated questions.program_type enum.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` ADD COLUMN `program_type` ENUM('PPG', 'PPPK', 'SKD') NOT NULL DEFAULT 'SKD';");
      console.log('Added program_type column to tryouts table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` MODIFY COLUMN `program_type` ENUM('PPG', 'PPPK', 'SKD') NOT NULL DEFAULT 'SKD';");
      console.log('Updated tryouts.program_type enum.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("CREATE INDEX `idx_tryouts_program_type` ON `tryouts` (`program_type`);");
      console.log('Added index on tryouts.program_type.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` ADD COLUMN `product_type` ENUM('TRYOUT', 'KELAS', 'EBOOK', 'BUNDLE') NOT NULL DEFAULT 'TRYOUT';");
      console.log('Added product_type column to tryouts table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` ADD COLUMN `wa_group_link` VARCHAR(255) DEFAULT NULL;");
      console.log('Added wa_group_link column to tryouts table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` ADD COLUMN `ebook_file_path` VARCHAR(255) DEFAULT NULL;");
      console.log('Added ebook_file_path column to tryouts table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` ADD COLUMN `benefits` JSON DEFAULT NULL;");
      console.log('Added benefits column to tryouts table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` ADD COLUMN `shield_award` JSON DEFAULT NULL;");
      console.log('Added shield_award column to tryouts table.');
    } catch (err) {
      // Ignore
    }

    try {
      await sequelize.query("ALTER TABLE `tryouts` ADD COLUMN `scoring_type` ENUM('BINARY', 'WEIGHTED_1_5', 'WEIGHTED_1_4') NOT NULL DEFAULT 'BINARY';");
      console.log('Added scoring_type column to tryouts table.');
    } catch (err) {
      // Ignore
    }

    // Alter columns to LONGTEXT to support base64 images and large description payloads
    try {
      await sequelize.query("ALTER TABLE `tryouts` MODIFY COLUMN `image_url` LONGTEXT;");
      await sequelize.query("ALTER TABLE `tryouts` MODIFY COLUMN `description` LONGTEXT;");
      await sequelize.query("ALTER TABLE `tryouts` MODIFY COLUMN `benefits` LONGTEXT;");
      await sequelize.query("ALTER TABLE `tryouts` MODIFY COLUMN `shield_award` LONGTEXT;");
      await sequelize.query("ALTER TABLE `transactions` MODIFY COLUMN `proof_image` LONGTEXT;");
      console.log('Altered package and transaction columns to LONGTEXT successfully.');
    } catch (err) {
      console.error('Failed to alter columns to LONGTEXT:', err.message);
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
