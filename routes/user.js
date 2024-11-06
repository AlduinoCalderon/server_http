const { Router } = require('express');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controller/usersController.js');
const router = Router();

// Definir rutas para los usuarios
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', postUser);
router.put('/:id', putUser);
router.delete('/:id', deleteUser);

module.exports = router;
