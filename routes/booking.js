const { Router } = require('express');
const { getBookings, getBooking, postBooking, putBooking, deleteBooking, getnewerBookings } = require('../controller/bookingsController.js');
const router = Router();

// Definir rutas para las reservas
router.get('/', getBookings);
router.get('/new', getnewerBookings);
router.get('/:id', getBooking);
router.post('/', postBooking);
router.put('/:id', putBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
