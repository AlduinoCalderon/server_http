const{ Router}= require('express');
const router = Router();

router.get('/', (req, resp) => {resp.json({respuesta:true, mensaje: 'Método get obtener todas las materias, realizado por Alduino' });});
router.post('/', (req, resp) =>{resp.json({respuesta:true, mensaje: 'Llamada a post - insertar'});});
router.put('/', (req, resp) => {resp.json({respuesta:true, mensaje: 'Método put realizado por Alduino' });});
router.delete('/', (req, resp) =>{resp.json({respuesta:true, mensaje: 'Método delete realizado por Alduino'});});

module.exports = router;