const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validar que se proporcionen email y contraseña
        if (!email || !password) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Email y contraseña son requeridos' 
            });
        }

        // Buscar usuario por email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar si el usuario está activo
        if (!user.is_active) {
            return res.status(403).json({
                status: 'error',
                message: 'Por favor verifica tu email antes de iniciar sesión'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                userId: user.user_id, 
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Enviar respuesta sin la contraseña
        const { password: _, ...userWithoutPassword } = user.toJSON();
        
        res.status(200).json({
            status: 'success',
            token,
            user: userWithoutPassword,
            message: 'Inicio de sesión exitoso'
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error en el servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Ruta para verificar el token
router.get('/verify-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar usuario para asegurar que aún existe
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        const { password: _, ...userWithoutPassword } = user.toJSON();
        
        res.status(200).json({
            status: 'success',
            user: userWithoutPassword,
            token: token
        });
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Token inválido o expirado'
        });
    }
});

module.exports = router; 