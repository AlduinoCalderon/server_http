// Cargar el archivo .env
require('dotenv').config();
const Server = require('./models/Server.js');

try {
    const serverExpress = new Server();
    serverExpress.listen();
} catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
} 