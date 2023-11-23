const { response } = require("express");
//const dbConnection = require('../database/conecta');
const MateriaModel = require('../models/materia');
const {QueryTypes} = require('sequelize');


const getMaterias = async (req, resp=response) => {
    const materias = await MateriaModel.sequelize.query("select* from materia", {type:QueryTypes.SELECT});
// const materias = await MateriaModel.findAll().catch('Error');
    resp.json(materias);
 
}

const getMateria = async (req, resp = response) => {
    const cve = req.params.cve;
    //const {cve} = req.params;
    const materia = await MateriaModel.findByPk(cve);
    if (materia==null){
        resp.json({
            respuesta: false,
            resultado:"No se encuentra"
        });
    }
    else{
        resp.json({
            respuesta: true,
            resultado: materia
        }); 
    }
}

const postMateria = async (req, resp = response) => {
    const {body} = req;
    const materiaParam = {
        nombreMateria   : body.nombreMateria,
        estadoMateria   : body.estadoMateria,
        semestreMateria : body.semestreMateria
    };
     
    
    try{
        const materia = await MateriaModel.sequelize.query("insert into materia(nombreMateria, estadoMateria, semestreMateria) values(:paramNombre, :paramEstado, :paramSemestre)", {replacements:{
            paramNombre : materiaParam.nombreMateria,
            paramEstado : materiaParam.estadoMateria,
            paramSemestre : materiaParam.semestreMateria
        }});
    //    const materia = await MateriaModel.create(materiaParam);
    
        resp.json({ Mensaje: "Inserción realizada.",
                    Nombre : materia[0],
                    Estado : materia[1],
                    Semestre : materia[2],
                    });
    //    resp.json(materia);
    }
    catch(error){
        console.log(error);
        resp.status(500).json({mensaje: "Error en el servidor"});
    }
}
const putMateria = async (req, resp = response) => {
   const {cve} = req.params;
   const {body} = req;
   try{
        const materia = await MateriaModel.findByPk(cve);
        if (!materia){
                return resp.status(404).json({
                    mensaje:"No se encuentra el registro"
                });
         
        }
        await materia.update(body);
        resp.json(materia);
   }
   catch(error){
    console.log(error);
   }

}
const deleteMateria = async (req, resp = response) => {
    
    const {cve} = req.params;
    try{
        const materia = await MateriaModel.findByPk(cve);
        if (!materia){
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        /*eliminación física
        await materia.destroy();
        */
       //eliminación lógica
        await materia.update({estadoMateria:false});
        resp.json({
            mensaje:"Registro eliminado"
        });
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    getMaterias,
    getMateria,
    postMateria,
    putMateria,
    deleteMateria
}