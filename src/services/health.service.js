const axios = require('axios');
const packageJson = require('../../package.json');

class HealthService {
    constructor() {
        this.externalServiceUrl = 'https://mantenimientoindustrial-tizq.onrender.com/api/health';
        this.nextExternalCheck = null;
        this.externalServiceStatus = null;
        this.lastCheck = null;
    }

    async checkDatabase(conecta) {
        try {
            await conecta.authenticate();
            return { status: 'connected' };
        } catch (error) {
            return { status: 'disconnected', error: error.message };
        }
    }

    scheduleExternalCheck() {
        // Programar la próxima verificación en 5 minutos
        const nextCheckTime = new Date();
        nextCheckTime.setMinutes(nextCheckTime.getMinutes() + 5);
        this.nextExternalCheck = nextCheckTime;

        // Programar la verificación real
        setTimeout(async () => {
            await this.checkExternalService();
        }, 2 * 60 * 1000);
    }

    async checkExternalService() {
        try {
            const response = await axios.get(this.externalServiceUrl);
            this.externalServiceStatus = {
                status: response.data.status || 'ok',
                timestamp: response.data.timestamp,
                database: response.data.database,
                message: response.data.message
            };
        } catch (error) {
            this.externalServiceStatus = {
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
        this.lastCheck = new Date();
    }

    async getStatus(conecta) {
        const dbStatus = await this.checkDatabase(conecta);
        const now = new Date();

        // Si es la primera vez o ha pasado más de 5 minutos desde la última verificación
        if (!this.lastCheck || (now - this.lastCheck) > 5 * 60 * 1000) {
            this.scheduleExternalCheck();
        }

        return {
            status: 'OK',
            timestamp: now.toISOString(),
            database: dbStatus.status === 'connected',
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            externalService: this.externalServiceStatus,
            nextExternalCheck: this.nextExternalCheck ? this.nextExternalCheck.toISOString() : null,
            message: this.externalServiceStatus ? 
                'Última verificación externa realizada' : 
                'La petición al endpoint externo se realizará en 5 minutos'
        };
    }
}

module.exports = new HealthService(); 