const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Ruta para registrar un nuevo usuario
router.post('/register', authController.registrar);

// Ruta para iniciar sesión
router.post('/login', authController.iniciarSesion);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        status: 'success',
        user: {
            id: req.user.id,
            nombre: req.user.nombre,
            email: req.user.email,
            rol: req.user.rol
        }
    });
});

module.exports = router;