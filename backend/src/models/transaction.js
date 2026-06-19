const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tryout_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending',
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  proof_image: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  tableName: 'transactions',
});

module.exports = Transaction;

