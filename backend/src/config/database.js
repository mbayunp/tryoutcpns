const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DB.NAME, env.DB.USER, env.DB.PASS, {
  host: env.DB.HOST,
  port: env.DB.PORT,
  dialect: 'mysql',
  logging: env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = sequelize;
