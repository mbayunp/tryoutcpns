const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tryout = sequelize.define('Tryout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  total_questions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  category: {
    type: DataTypes.ENUM('Tryout', 'Kelas Online', 'E-Book', 'Bundling'),
    allowNull: false,
    defaultValue: 'Tryout',
  },
  image_url: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  original_price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  discount_percentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: 'tryouts',
});

module.exports = Tryout;
