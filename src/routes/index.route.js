const express = require('express');
const router = express.Router();

// Importar todas las rutas
const healthRoutes = require('./health.route');
const userRoutes = require('./user.route');
const cabinRoutes = require('./cabin.route');
const bookingRoutes = require('./booking.route');
const paymentRoutes = require('./payment.route');
const imageRoutes = require('./image.route');
const authRoutes = require('./auth.route');

// Registrar todas las rutas
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/cabins', cabinRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/images', imageRoutes);
router.use('/auth', authRoutes);

module.exports = router; 