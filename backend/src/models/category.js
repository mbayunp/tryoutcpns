const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  program_type: {
    type: DataTypes.ENUM('PPG', 'PPPK', 'SKD'),
    allowNull: false,
    defaultValue: 'SKD'
  },
}, {
  tableName: 'categories',
});

module.exports = Category;
