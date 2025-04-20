const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendVerificationEmail } = require('../utils/email.utils');

class AuthController {
    async registrar(req, res) {
        try {
            const { first_name, last_name, email, password, telefono } = req.body;
            console.log(`[REGISTRO] Intento de registro para email: ${email}`);

            // Verificar si el usuario ya existe
            const usuarioExistente = await User.findOne({ where: { email } });
            if (usuarioExistente) {
                console.log(`[REGISTRO] Email ya registrado: ${email}`);
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

            console.log(`[REGISTRO] Usuario creado exitosamente: ${email}`);

            // Enviar email de verificación
            const emailEnviado = await sendVerificationEmail(usuario.email, usuario.verification_token);
            if (!emailEnviado) {
                console.log(`[REGISTRO] Error al enviar email de verificación a: ${email}`);
            }

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
            console.error(`[REGISTRO] Error al registrar usuario: ${error.message}`);
            console.error(`[REGISTRO] Stack trace: ${error.stack}`);
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
            console.log(`[LOGIN] Intento de inicio de sesión para email: ${email}`);

            // Buscar usuario
            const usuario = await User.findOne({ where: { email } });
            if (!usuario) {
                console.log(`[LOGIN] Usuario no encontrado: ${email}`);
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                console.log(`[LOGIN] Contraseña incorrecta para usuario: ${email}`);
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar si el usuario está activo
            if (!usuario.is_active) {
                console.log(`[LOGIN] Usuario inactivo intentando acceder: ${email}`);
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

            console.log(`[LOGIN] Inicio de sesión exitoso para usuario: ${email}`);

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
            console.error(`[LOGIN] Error al iniciar sesión: ${error.message}`);
            console.error(`[LOGIN] Stack trace: ${error.stack}`);
            res.status(500).json({
                status: 'error',
                message: 'Error al iniciar sesión',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController(); 