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

const postMateria = async (req, res = response) => {
    const {body}  = req;
    const materiaParam = {
        nombreMateria   : body.nombreMateria,
        estadoMateria   : body.estadoMateria,
        semestreMateria : body.semestreMateria
    };
    try {
        const materia = await materiaModel.create(materiaParam);
        res.json({mensaje:"Datos insertados", datos: materia});
    }
    catch(error){
        console.log(error);
        res.status(500).json({mensaje:"Error en el servidor."});

    }

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