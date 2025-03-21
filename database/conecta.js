require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbConn = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    dialectOptions: {
      connectTimeout: 10000,
      allowPublicKeyRetrieval: true
    }
  }
);

module.exports = dbConn;
