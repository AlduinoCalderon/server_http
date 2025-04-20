const { DataTypes } = require('sequelize');
const conecta = require('../config/connection.db');

const Image = conecta.define('image', {
    image_id: {  // Clave primaria
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cabin_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'cabins', // nombre de la tabla referenciada
            key: 'cabin_id'
        }
    },
    path: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    tableName: 'images',  // Nombre de la tabla
    timestamps: false     // Desactivar el manejo automático de timestamps
});

module.exports = Image;

