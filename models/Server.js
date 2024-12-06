const express = require('express');
const cors = require('cors');
const conecta = require('../database/conecta');

class Server {
    constructor() {
        this.app = express();
        this.port = 8001;
        this.fnConecta();
        this.middleware();
        this.routes();
    }

    async fnConecta() {
        try {
            await conecta.authenticate();
            console.log('Base de datos conectada');
        } catch (error) {
            console.log(error);
        }
    }

    middleware() {
        // Para enviar datos al servidor
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/users', require('../routes/user'));
        this.app.use('/cabins', require('../routes/cabin'));
        this.app.use('/bookings', require('../routes/booking'));
        this.app.use('/payments', require('../routes/payment'));
        this.app.use('/images', require('../routes/image'));
        this.app.use('/email', require('../routes/email'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Escuchando en puerto', this.port);
        });
    }
}

module.exports = Server;
