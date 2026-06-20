const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transaction_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  payment_gateway_ref: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'payments',
});

module.exports = Payment;
