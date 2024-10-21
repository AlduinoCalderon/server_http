const { DataTypes } = require('sequelize');
const conecta = require('../database/conecta');

const User = conecta.define('user', {
    user_id: {  // Clave primaria
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    last_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    middle_name: { 
        type: DataTypes.STRING 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role: { 
        type: DataTypes.ENUM('user', 'admin'), 
        allowNull: false 
    },
    registration_date: {  // Fecha de creación
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, // Almacena la fecha actual al crear un nuevo registro
        allowNull: false // Se puede marcar como no nulo si es obligatorio
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
    modified_date: {  // Fecha de última actualización
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, // Almacena la fecha actual al crear un nuevo registro
        onUpdate: DataTypes.NOW, // Actualiza automáticamente en cada modificación
        allowNull: false // Se puede marcar como no nulo si es obligatorio
    },
    connection_string: {  // Nuevo campo
        type: DataTypes.TEXT, // Tipo TEXT en MySQL
        allowNull: true // Cambia a false si es obligatorio
    }
}, {
    tableName: 'users',  // Nombre de la tabla
    timestamps: false,    // Desactivar el manejo automático de timestamps
});

module.exports = User;
