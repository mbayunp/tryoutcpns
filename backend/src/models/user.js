const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registration_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'users',
});

module.exports = User;
