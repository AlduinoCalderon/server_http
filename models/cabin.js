const { DataTypes } = require('sequelize');
const conecta = require('../database/conecta');

const Cabin = conecta.define('cabin', {
    cabin_id: {  // Clave primaria
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { 
        type: DataTypes.STRING(100), // Longitud máxima de 100
        allowNull: false 
    },
    capacity: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    location: { 
        type: DataTypes.STRING(255) // Longitud máxima de 255
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
    cost_per_night: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    }
}, {
    tableName: 'cabins',  // Nombre de la tabla
    timestamps: false,    // Desactivar el manejo automático de timestamps
});

module.exports = Cabin;
