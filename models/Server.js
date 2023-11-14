const express = require('express');
const cors = require ('cors');
const conecta = require('../database/conecta');
class Server{
    constructor(){
        this.app = express();
        this.port = 8001;
        this.fnConecta();
        this.middleware();
        //this.routes();
        this.app.use('/materia', require('../routes/materia'));
    }
    async fnConecta(){
        try{
            await conecta.authenticate();
            console.log('Base de datos conectada');
        }
        catch(error){
            console.log(error);
        }
    }
    middleware(){
        //Para enviar datos al servidor
        this.app.use(cors());
        this.app.use(express.json());
        //
        this.app.use(express.static('public'));
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Escuchando en puerto', this.port);
        });
    }
}

//para que otro archivo vea esta class
module.exports = Server;