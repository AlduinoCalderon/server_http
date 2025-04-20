const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const conecta = require('../config/connection.db');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8001;
        this.fnConecta();
        this.middleware();
        this.routes();
    }

    async fnConecta() {
        try {
            await conecta.authenticate();
            console.log('✅ Base de datos conectada');
        } catch (error) {
            console.error('❌ Error al conectar con la base de datos:', error);
            process.exit(1);
        }
    }

    middleware() {
        // Configuración de seguridad
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json({ limit: '10kb' }));
        this.app.use(express.static('public'));
        
        // Configuración de rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        });
        this.app.use(limiter);

        // Logging
        this.app.use(morgan('combined'));
    }

    routes() {
        // Usar el index de rutas
        this.app.use('/api', require('../routes/index.route'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${this.port}`);
            console.log(`📚 Documentación de la API en http://localhost:${this.port}/api-docs`);
        });
    }
}

module.exports = Server; 