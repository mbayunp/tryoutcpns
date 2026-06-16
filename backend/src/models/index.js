const sequelize = require('../config/database');
const User = require('./user');
const Category = require('./category');
const Tryout = require('./tryout');
const Question = require('./question');
const Attempt = require('./attempt');
const Answer = require('./answer');

// Placeholder models
const Package = require('./package');
const Transaction = require('./transaction');
const Payment = require('./payment');
const Video = require('./video');

// Associations
// 1. User <-> Attempt
User.hasMany(Attempt, { foreignKey: 'user_id', as: 'attempts' });
Attempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 2. Tryout <-> Attempt
Tryout.hasMany(Attempt, { foreignKey: 'tryout_id', as: 'attempts' });
Attempt.belongsTo(Tryout, { foreignKey: 'tryout_id', as: 'tryout' });

// 3. Tryout <-> Question
Tryout.hasMany(Question, { foreignKey: 'tryout_id', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Tryout, { foreignKey: 'tryout_id', as: 'tryout' });

// 4. Category <-> Question
Category.hasMany(Question, { foreignKey: 'category_id', as: 'questions' });
Question.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// 5. Attempt <-> Answer
Attempt.hasMany(Answer, { foreignKey: 'attempt_id', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(Attempt, { foreignKey: 'attempt_id', as: 'attempt' });

// 6. Question <-> Answer
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// Placeholders Associations (For future expansion)
User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Package.hasMany(Transaction, { foreignKey: 'package_id', as: 'transactions' });
Transaction.belongsTo(Package, { foreignKey: 'package_id', as: 'package' });

Transaction.hasOne(Payment, { foreignKey: 'transaction_id', as: 'payment' });
Payment.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });

Category.hasMany(Video, { foreignKey: 'category_id', as: 'videos' });
Video.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

const db = {
  sequelize,
  User,
  Category,
  Tryout,
  Question,
  Attempt,
  Answer,
  Package,
  Transaction,
  Payment,
  Video
};

module.exports = db;
