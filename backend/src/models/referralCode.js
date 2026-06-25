const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReferralCode = sequelize.define('ReferralCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  discount_percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  usage_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'referral_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ReferralCode;
