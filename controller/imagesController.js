const { Image } = require('../models');
const upload = require('../utils/s3');

// Obtener todas las imágenes
const getImages = async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las imágenes' });
  }
};

// Obtener una imagen por ID
const getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la imagen' });
  }
};

// Crear una nueva imagen
const postImage = async (req, res) => {
  try {
    const { cabin_id, path } = req.body;
    const image = await Image.create({ cabin_id, path });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la imagen' });
  }
};

// Actualizar una imagen
const putImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { cabin_id, path } = req.body;
    const image = await Image.findByPk(id);
    if (image) {
      image.cabin_id = cabin_id;
      image.path = path;
      await image.save();
      res.json(image);
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la imagen' });
  }
};

// Eliminar una imagen
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);
    if (image) {
      await image.destroy();
      res.json({ message: 'Imagen eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
};

// Subir una imagen a S3
const uploadImage = async (req, res) => {
  try {
    const { cabin_id } = req.body;
    const imageUrl = req.file.location;

    const image = await Image.create({
      cabin_id: cabin_id,
      path: imageUrl
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
};

module.exports = { getImages, getImage, postImage, putImage, deleteImage, uploadImage };
