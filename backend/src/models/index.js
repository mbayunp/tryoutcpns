const sequelize = require('../config/database');
const User = require('./user');
const Category = require('./category');
const Tryout = require('./tryout');
const Question = require('./question');
const Attempt = require('./attempt');
const Answer = require('./answer');
const PackageQuestion = require('./packageQuestion');
const AttemptAnswer = require('./attemptAnswer');

// Placeholder models
const Package = require('./package');
const Transaction = require('./transaction');
const Payment = require('./payment');
const Video = require('./video');
const Announcement = require('./announcement');

// Associations
// 1. User <-> Attempt
User.hasMany(Attempt, { foreignKey: 'user_id', as: 'attempts' });
Attempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 2. Tryout <-> Attempt
Tryout.hasMany(Attempt, { foreignKey: 'tryout_id', as: 'attempts' });
Attempt.belongsTo(Tryout, { foreignKey: 'tryout_id', as: 'tryout' });

// 3. Tryout <-> Question (One-to-Many Direct)
Tryout.hasMany(Question, { foreignKey: 'tryout_id', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Tryout, { foreignKey: 'tryout_id', as: 'tryout' });

// Many-to-Many Tryout <-> Question through package_questions
Tryout.belongsToMany(Question, { through: PackageQuestion, foreignKey: 'package_id', otherKey: 'question_id', as: 'questionsMany' });
Question.belongsToMany(Tryout, { through: PackageQuestion, foreignKey: 'question_id', otherKey: 'package_id', as: 'tryoutsMany' });

// 4. Category <-> Question
Category.hasMany(Question, { foreignKey: 'category_id', as: 'questions' });
Question.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// 5. Attempt <-> Answer
Attempt.hasMany(Answer, { foreignKey: 'attempt_id', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(Attempt, { foreignKey: 'attempt_id', as: 'attempt' });

// 6. Question <-> Answer
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// 7. Attempt <-> AttemptAnswer
Attempt.hasMany(AttemptAnswer, { foreignKey: 'attempt_id', as: 'attemptAnswers', onDelete: 'CASCADE' });
AttemptAnswer.belongsTo(Attempt, { foreignKey: 'attempt_id', as: 'attempt' });

// 8. Question <-> AttemptAnswer
Question.hasMany(AttemptAnswer, { foreignKey: 'question_id', as: 'attemptAnswers', onDelete: 'CASCADE' });
AttemptAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// Placeholders Associations (For future expansion)
User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Tryout.hasMany(Transaction, { foreignKey: 'tryout_id', as: 'transactions' });
Transaction.belongsTo(Tryout, { foreignKey: 'tryout_id', as: 'tryout' });

Transaction.hasOne(Payment, { foreignKey: 'transaction_id', as: 'payment' });
Payment.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });

Category.hasMany(Video, { foreignKey: 'category_id', as: 'videos' });
Video.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// 9. User <-> Announcement (Notifications)
User.hasMany(Announcement, { foreignKey: 'user_id', as: 'announcements' });
Announcement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

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
  Video,
  PackageQuestion,
  AttemptAnswer,
  Announcement
};

module.exports = db;
