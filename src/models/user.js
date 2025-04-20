const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const conecta = require('../config/connection.db');

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
        allowNull: false
    },
    role: { 
        type: DataTypes.ENUM('user', 'admin'), 
        allowNull: false,
        defaultValue: 'user'
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
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
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }   
});

module.exports = User;
