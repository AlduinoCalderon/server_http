const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No se proporcionó un token de autenticación'
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar el usuario
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si el email está verificado
        if (!user.email_verified) {
            return res.status(403).json({
                status: 'error',
                message: 'Por favor verifica tu email antes de continuar'
            });
        }

        // Agregar el usuario al request
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Token inválido o expirado'
        });
    }
};

module.exports = authMiddleware; 