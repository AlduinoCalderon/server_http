const express = require('express');
const { sendEmail } = require('../controller/emailController');
const router = express.Router();

// Ruta para enviar correos electrónicos
router.post('/send-email', sendEmail);

module.exports = router;
