const { Router } = require('express');
const { getPayments, getPayment, postPayment, putPayment, deletePayment } = require('../controllers/payments.controller.js');
const router = Router();

// Definir rutas para los pagos
router.get('/', getPayments);
router.get('/:id', getPayment);
router.post('/', postPayment);
router.put('/:id', putPayment);
router.delete('/:id', deletePayment);

module.exports = router;
