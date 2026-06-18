const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attempt = sequelize.define('Attempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tryout_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  twk: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  tiu: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  tkp: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  result: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  finished_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('ongoing', 'completed'),
    defaultValue: 'ongoing',
  },
}, {
  tableName: 'attempts',
});

module.exports = Attempt;
