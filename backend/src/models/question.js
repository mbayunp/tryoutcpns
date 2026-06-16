const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tryout_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_a: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_b: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_c: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_d: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  option_e: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  correct_answer: {
    type: DataTypes.STRING(5), // 'a', 'b', 'c', 'd', 'e'
    allowNull: false,
  },
  option_weights: {
    type: DataTypes.JSON, // e.g. { "a": 5, "b": 4, "c": 3, "d": 2, "e": 1 }
    allowNull: true,
  },
}, {
  tableName: 'questions',
});

module.exports = Question;
