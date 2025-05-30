const { Router } = require('express');
const { getUsers, getUser, postUser, putUser, deleteUser, registerUser, verifyEmail } = require('../controllers/users.controller.js');
const router = Router();

router.get('/', getUsers); // Obtener todos los usuarios
router.get('/:id', getUser); // Obtener un usuario por ID
router.post('/', postUser); // Crear un usuario (usado en administración o pruebas)
router.post('/register', registerUser); // Registrar un nuevo usuario
router.get('/verify-email/:email/:verification_token', verifyEmail); // Verificar el correo usando el email y token
router.put('/:id', putUser); // Actualizar un usuario por ID
router.delete('/:id', deleteUser); // Eliminar un usuario por ID

module.exports = router;
