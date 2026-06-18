const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'announcements',
});

module.exports = Announcement;
