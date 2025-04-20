const express = require('express');
const router = express.Router();
const healthService = require('../services/health.service');
const conecta = require('../config/connection.db');
const packageJson = require('../../package.json');

// Verificar el servicio externo cada 5 minutos
setInterval(() => {
    healthService.checkExternalService();
}, 5 * 60 * 1000);

// Verificar inmediatamente al iniciar
healthService.checkExternalService();

router.get('/', async (req, res) => {
    try {
        const status = await healthService.getStatus(conecta);
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router; 