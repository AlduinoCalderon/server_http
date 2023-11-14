const {DataTypes} = require('sequelize');
const conecta = require('../database/conecta');
const Materia = conecta.define('materia', {nombreMateria:{type:DataTypes.STRING},estadoMateria:{type:DataTypes.BOOLEAN},semestreMateria:{type:DataTypes.TINYINT}});

module.exports = Materia;