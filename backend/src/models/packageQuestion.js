const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PackageQuestion = sequelize.define('PackageQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'package_questions',
  timestamps: false,
});

module.exports = PackageQuestion;
