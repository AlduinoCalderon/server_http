const { response } = require("express");
const CabinModel = require('../models/cabin');
const { QueryTypes } = require('sequelize');

const getCabins = async (req, resp = response) => {
    const cabins = await CabinModel.sequelize.query("SELECT * FROM cabins WHERE is_active = true", { type: QueryTypes.SELECT });
    resp.json(cabins);
}

const getCabin = async (req, resp = response) => {
    const id = req.params.id;
    const cabin = await CabinModel.findByPk(id);
    if (cabin==null) {
        resp.json({
            respuesta: false,
            resultado: "No se encuentra"
        });
    } else {
        resp.json({
            respuesta: true,
            resultado: cabin
        });
    }
}

const postCabin = async (req, resp = response) => {
    const { body } = req;
    try {
        const cabin = await CabinModel.create(body);
        resp.json({
            Mensaje: "Inserción realizada.",
            Cabin: cabin
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
}

const putCabin = async (req, resp = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const cabin = await CabinModel.findByPk(id);
        if (cabin==null) {
            return resp.status(404).json({
                mensaje: "No se encuentra el registro"
            });
        }
        await cabin.update(body);
        resp.json(cabin);
    } catch (error) {
        console.log(error);
    }
}

const deleteCabin = async (req, resp = response) => {
    const { id } = req.params;
    try {
        const cabin = await CabinModel.findByPk(id);
        if (cabin==null) {
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        await cabin.update({ is_active: false });
        resp.json({
            mensaje: "Registro eliminado"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getCabins,
    getCabin,
    postCabin,
    putCabin,
    deleteCabin
}
