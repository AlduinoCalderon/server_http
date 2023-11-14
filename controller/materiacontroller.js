const { response } = require("express");
const materiaModel = require('../models/materia');


const getMaterias = async (req, res=response) => {
    const materias = await materiaModel.findAll();
    res.json(materias);
}

const getMateria = (req, res = response) => {
   
    res.json({
        respuesta:true,
        mensaje: 'Llamada a get - consulta solo 1'
    });

}

const postMateria = (req, res = response) => {
    const body = req.body;
    res.json({
        respuesta:true,
        mensaje: 'Llamada a post - insertar',
        body
    });

}
const putMateria = (req, res = response) => {
    res.json({
        respuesta:true,
        mensaje: 'Llamada a put - actualizar'
    });

}
const deleteMateria = (req, res = response) => {
    res.json({
        respuesta:true,
        mensaje: 'Llamada a delete - eliminar'
    });

}

module.exports = {
    getMaterias,
    getMateria,
    postMateria,
    putMateria,
    deleteMateria
    
}