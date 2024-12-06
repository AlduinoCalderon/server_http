const { Router } = require('express');
const { getImages, getImage, postImage, putImage, deleteImage, uploadImage } = require('../controller/imagesController');


const router = Router();

// Rutas para las imágenes
router.get('/', getImages);
router.get('/:id', getImage);
router.post('/', postImage);
router.put('/:id', putImage);
router.delete('/:id', deleteImage);

module.exports = router;
