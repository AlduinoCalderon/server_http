const { response } = require("express");

const getMaterias = (req, resp=response) =>  {resp.json({respuesta:true, mensaje: 'Método get obtener todas las materias, realizado por Alduino' });}

const getMateria = (req, resp=response) => {resp.json({ respuesta:true, mensaje: 'Método get consultgar una materia, realizado por Alduino' });}

const postMateria = (req, resp=response) =>  {
    const body = req.body;
    resp.json({body, respuesta:true, mensaje: 'Método post para insertar materia, realizado por Alduino' });}

const putMateria = (req, resp=response) => {resp.json({respuesta:true, mensaje: 'Método put para actualizar materia, realizado por Alduino' });}

const deleteMateria = (req, resp=response)  => {resp.json({respuesta:true, mensaje: 'Método delete para eliminar materia, realizado por Alduino' });}

module.exports = { getMateria, getMaterias, postMateria, putMateria, deleteMateria};