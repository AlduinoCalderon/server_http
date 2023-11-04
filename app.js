//cargar el archivo .env
const Server = require('./models/Server');

const serverExpress = new Server();
serverExpress.listen();



