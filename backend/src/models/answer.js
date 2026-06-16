const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attempt_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  selected_answer: {
    type: DataTypes.STRING(5), // 'a', 'b', 'c', 'd', 'e' or null
    allowNull: true,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: 'answers',
});

module.exports = Answer;
