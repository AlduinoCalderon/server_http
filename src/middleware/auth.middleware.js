const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('[AUTH] No se proporcionó token de autenticación');
            return res.status(401).json({
                status: 'error',
                message: 'No se proporcionó un token de autenticación'
            });
        }

        // Verificar el token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error(`[AUTH] Error al verificar token: ${error.message}`);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'El token ha expirado'
                });
            }
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido'
            });
        }
        
        // Buscar el usuario
        const user = await User.findByPk(decoded.user_id);
        
        if (!user) {
            console.log(`[AUTH] Usuario no encontrado para token: ${decoded.user_id}`);
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si el usuario está activo
        if (!user.is_active) {
            console.log(`[AUTH] Usuario inactivo intentando acceder: ${user.email}`);
            return res.status(403).json({
                status: 'error',
                message: 'Tu cuenta está desactivada'
            });
        }

        // Agregar el usuario al request
        req.user = user;
        console.log(`[AUTH] Autenticación exitosa para usuario: ${user.email}`);
        next();
    } catch (error) {
        console.error(`[AUTH] Error en middleware de autenticación: ${error.message}`);
        console.error(`[AUTH] Stack trace: ${error.stack}`);
        res.status(500).json({
            status: 'error',
            message: 'Error en la autenticación',
            error: error.message
        });
    }
};

module.exports = authMiddleware; 