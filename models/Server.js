const express = require('express');
const cors = require('cors');
class Server{
    constructor(){
        this.app = express();
        this.port = 8001;
        this.middleware();
        this.app.use('/materia', require('../routes/materia'));
    }
   
    
    middleware(){ 
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }
    listen(){ this.app.listen(this.port, () => { console.log('Escuchando en puerto', this.port);  }); }
}

//para que otro archivo vea esta class
module.exports = Server;