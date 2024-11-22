const multer = require('multer');
const path = require('path');

// Configuración para almacenar archivos localmente
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Asigna un nombre único al archivo
  }
});

// Configura multer con el almacenamiento local
const upload = multer({ storage: storage });

module.exports = upload;
