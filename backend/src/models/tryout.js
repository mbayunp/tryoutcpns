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
    type: DataTypes.TEXT('long'),
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
  program_type: {
    type: DataTypes.ENUM('PPG', 'PPPK', 'SKD'),
    allowNull: false,
    defaultValue: 'SKD'
  },
  product_type: {
    type: DataTypes.ENUM('TRYOUT', 'KELAS', 'EBOOK', 'BUNDLE'),
    allowNull: false,
    defaultValue: 'TRYOUT'
  },
  wa_group_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ebook_file_path: {
    type: DataTypes.STRING,
    allowNull: true
  },
  benefits: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  shield_award: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  scoring_type: {
    type: DataTypes.ENUM('BINARY', 'WEIGHTED_1_5', 'WEIGHTED_1_4'),
    allowNull: false,
    defaultValue: 'BINARY',
  },
}, {
  tableName: 'tryouts',
});

module.exports = Tryout;
