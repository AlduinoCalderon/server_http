const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendVerificationEmail } = require('../utils/email.utils');

class AuthController {
    async registrar(req, res) {
        try {
            const { first_name, last_name, email, password, telefono } = req.body;

            // Verificar si el usuario ya existe
            const usuarioExistente = await User.findOne({ where: { email } });
            if (usuarioExistente) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El email ya está registrado'
                });
            }

            // Hash de la contraseña
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Crear usuario
            const usuario = await User.create({
                first_name,
                last_name,
                email,
                password: passwordHash,
                telefono,
                role: 'user',
                is_active: true,
                verification_token: jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' })
            });

            // Enviar email de verificación
            await sendVerificationEmail(usuario.email, usuario.verification_token);

            // Eliminar datos sensibles antes de enviar la respuesta
            const usuarioResponse = {
                user_id: usuario.user_id,
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                email: usuario.email,
                telefono: usuario.telefono,
                role: usuario.role,
                is_active: usuario.is_active
            };

            res.status(201).json({
                status: 'success',
                message: 'Usuario registrado exitosamente',
                usuario: usuarioResponse
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error al registrar usuario',
                error: error.message
            });
        }
    }

    async iniciarSesion(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const usuario = await User.findOne({ where: { email } });
            if (!usuario) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar si el usuario está activo
            if (!usuario.is_active) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Tu cuenta está desactivada'
                });
            }

            // Generar token
            const token = jwt.sign(
                {
                    user_id: usuario.user_id,
                    email: usuario.email,
                    role: usuario.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Eliminar datos sensibles antes de enviar la respuesta
            const usuarioResponse = {
                user_id: usuario.user_id,
                first_name: usuario.first_name,
                last_name: usuario.last_name,
                email: usuario.email,
                telefono: usuario.telefono,
                role: usuario.role,
                is_active: usuario.is_active
            };

            res.json({
                status: 'success',
                token,
                usuario: usuarioResponse
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error al iniciar sesión',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController(); 