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
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'contraseña123' 
    },
    role: { 
        type: DataTypes.ENUM('user', 'admin'), 
        allowNull: false,
        defaultValue: 'user'
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    telefono: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    registration_date: {  
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, 
        allowNull: false 
    },
    modified_date: {  
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, 
        onUpdate: DataTypes.NOW, 
        allowNull: false 
    }, 
    verification_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',  
    timestamps: false,   
});

module.exports = User;
