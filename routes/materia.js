/*se recomienda crear un archivo por cada acceso a 
el modelo: materia.js -> tablaMateria
profesor.js -> tablaProfesor
*/
const {Router} = require('express');
const {getMaterias, getMateria, postMateria, putMateria, deleteMateria} = require ('../controller/materiacontroller');
const router = Router();
//aquí se van a colocar todas las rutas del proyecto
router.get('/', getMaterias);
router.get('/:cve', getMateria);
router.post ('/', postMateria);
router.put('/',putMateria);
router.delete('/', deleteMateria);

module.exports = router;