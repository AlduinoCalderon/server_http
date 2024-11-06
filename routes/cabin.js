const { Router } = require('express');
const { getCabins, getCabin, postCabin, putCabin, deleteCabin } = require('../controller/cabinsController.js');
const router = Router();

// Definir rutas para las cabañas
router.get('/', getCabins);
router.get('/:id', getCabin);
router.post('/', postCabin);
router.put('/:id', putCabin);
router.delete('/:id', deleteCabin);

module.exports = router;
