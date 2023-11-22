/*se recomienda crear un archivo por cada acceso a 
el modelo: materia.js -> tablaMateria
profesor.js -> tablaProfesor
*/
const {Router} = require('express');
const {getMaterias,
getMateria,
postMateria,
putMateria,
deleteMateria} = require('../controller/materiacontroller');
const router = Router();
/*
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
$ npm install --save oracledb # Oracle Database

*/

//aquí se van a colocar todas las rutas del proyecto

router.get('/', getMaterias);
router.get('/:cve', getMateria);
router.post('/', postMateria);
router.put('/:cve', putMateria);
router.delete('/:cve', deleteMateria);

module.exports = router;