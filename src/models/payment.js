const { DataTypes } = require('sequelize');
const conecta = require('../config/connection.db');

const Payment = conecta.define('payment', {
    payment_id: {  // Clave primaria
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'bookings', // nombre de la tabla referenciada
            key: 'booking_id'
        }
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('MercadoPago', 'PayPal', 'Card'),
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'payments',  // Nombre de la tabla
    timestamps: false       // Desactivar el manejo automático de timestamps
});

module.exports = Payment;
