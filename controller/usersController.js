const { response } = require("express");
const UserModel = require('../models/user');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendGridEmailService');
const crypto = require('crypto');
const getUsers = async (req, resp = response) => {
    const users = await UserModel.sequelize.query("SELECT * FROM users WHERE is_active = true", { type: QueryTypes.SELECT });
    resp.json(users);
};

const getUser = async (req, resp = response) => {
    const userId = req.params.id;
    const user = await UserModel.findByPk(userId);
    if (user == null) {
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
};

// Función para registrar un usuario
const registerUser = async (req, resp = response) => {
    const { first_name, last_name, email, password, telefono, role } = req.body;

    try {
        // Crear el usuario en la base de datos con is_active: false
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            telefono,
            role,
            is_active: false
        });

        // Generar un token para la verificación
        const verificationToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Actualizar el campo verification_token en la base de datos
        await user.update({ verification_token: verificationToken });

        // Enviar correo de verificación
        const verificationUrl = `https://cabinsfront.vercel.app/verificar?token=${verificationToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Verifica tu correo en el Sistema de Reserva de Cabañas',
            templateId: 'd-acb1046415524009a88be06ea3d9b091', // ID de la plantilla de SendGrid
            dynamicTemplateData: {
                verificationUrl
            }
        });

        resp.json({
            mensaje: "Usuario registrado. Revisa tu correo para verificar tu cuenta."
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// Función para verificar el token y activar la cuenta
const verifyEmail = async (req, resp = response) => {
    const { token } = req.query;

    try {
        // Decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario con el ID decodificado
        const user = await UserModel.findByPk(decoded.userId);
        if (!user) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Verificar que el token coincide
        if (user.verification_token !== token) {
            return resp.status(400).json({ mensaje: "Token no válido" });
        }

        // Activar la cuenta
        await user.update({ is_active: true, verification_token: null }); // Descartamos el token después de verificar

        resp.json({ mensaje: "Cuenta verificada con éxito" });
    } catch (error) {
        console.log(error);
        resp.status(400).json({ mensaje: "Token no válido o expirado" });
    }
};
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
};

const putUser = async (req, resp = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const user = await UserModel.findByPk(id);
        if (user == null) {
            return resp.status(404).json({
                mensaje: "No se encuentra el registro"
            });
        }
        await user.update(body);
        resp.json(user);
    } catch (error) {
        console.log(error);
    }
};

const deleteUser = async (req, resp = response) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findByPk(id);
        if (user == null) {
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
};

module.exports = {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
    registerUser,
    verifyEmail
};
