require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbConn = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    dialectOptions: {
      connectTimeout: 10000,
      allowPublicKeyRetrieval: true,
      ssl: {
        rejectUnauthorized: false
      },
      version: '10.6'
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

module.exports = dbConn;
