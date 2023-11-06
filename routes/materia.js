const{Router}= require('express');
const router = Router();
const{getMateria, getMaterias, postMateria, putMateria, deleteMateria}= require('../controller/materiacontroller');
router.get('/', getMaterias);
router.post('/', postMateria);
router.put('/', putMateria);
router.delete('/', deleteMateria);

module.exports = router;