const Image = require('../models/image');

// Obtener todas las imágenes
const getImages = async (req, res) => {
    try {
        const images = await Image.findAll();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las imágenes', error });
    }
};

// Obtener una imagen por ID
const getImage = async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la imagen', error });
    }
};

// Crear una nueva imagen
const postImage = async (req, res) => {
    const { cabin_id, path } = req.body;
    try {
        const newImage = await Image.create({ cabin_id, path });
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la imagen', error });
    }
};

// Actualizar una imagen por ID
const putImage = async (req, res) => {
    const { id } = req.params;
    const { cabin_id, path } = req.body;
    try {
        const image = await Image.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        await image.update({ cabin_id, path });
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la imagen', error });
    }
};

// Eliminar una imagen por ID 
const deleteImage = async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        await image.destroy(); 
        res.json({ message: 'Imagen eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la imagen', error });
    }
};

module.exports = {
    getImages,
    getImage,
    postImage,
    putImage,
    deleteImage
};
