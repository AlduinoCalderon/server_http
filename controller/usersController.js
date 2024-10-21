const { response } = require("express");
const UserModel = require('../models/user');
const { QueryTypes } = require('sequelize');

const getUsers = async (req, resp = response) => {
    const users = await UserModel.sequelize.query("SELECT * FROM users WHERE is_active = true", { type: QueryTypes.SELECT });
    resp.json(users);
}

const getUser = async (req, resp = response) => {
    const userId = req.params.id;
    const user = await UserModel.findByPk(userId);
    if (user==null) {
        resp.json({
            respuesta: false,
            resultado: "No se encuentra"
        });
    } else {
        resp.json({
            respuesta: true,
            resultado: user
        });
    }
}

const postUser = async (req, resp = response) => {
    const { body } = req;
    try {
        const user = await UserModel.create(body);
        resp.json({
            Mensaje: "Inserción realizada.",
            User: user
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
}

const putUser = async (req, resp = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const user = await UserModel.findByPk(id);
        if (user==null) {
            return resp.status(404).json({
                mensaje: "No se encuentra el registro"
            });
        }
        await user.update(body);
        resp.json(user);
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, resp = response) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findByPk(id);
        if (user==null) {
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        await user.update({ is_active: false });
        resp.json({
            mensaje: "Registro eliminado"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser
}
