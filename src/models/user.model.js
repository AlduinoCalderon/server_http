const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection.db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id'
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        field: 'email'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password'
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'telefono'
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        field: 'role'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    },
    verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'verification_token'
    }
}, {
    timestamps: true,
    createdAt: 'registration_date',
    updatedAt: 'modified_date',
    tableName: 'users'
});

module.exports = User; 