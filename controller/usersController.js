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
        const verificationUrl = `https://cabinsfront.vercel.app/users/${userId}/verify/${verificationToken}`;

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

const verifyEmail = async (req, res) => {
    try {
      const { id, token } = req.params;
  
      // Buscar al usuario por ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Validar el token
      const isValid = verifyToken(token, user.email); // Asegúrate de usar un método seguro
      if (!isValid) {
        return res.status(400).json({ message: 'Token inválido o expirado' });
      }
  
      // Verificar al usuario
      user.is_active = true;
      await user.save();
  
      res.status(200).json({ message: 'Correo verificado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al verificar el correo' });
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
