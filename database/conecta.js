const {Sequelize} = require('sequelize');
const nombreDB = 'pruebanode';
const usuario = 'root';
const password = '';
const servidor = 'localhost';

const dbConn = new Sequelize(nombreDB, usuario, password, {host:servidor,dialect:'mariadb'});

module.exports = dbConn;