const { DataTypes } = require('sequelize');
const conecta = require('../config/connection.db');

const Booking = conecta.define('booking', {
    booking_id: {  // Clave primaria
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    cabin_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    start_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    nights: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 1 
    },
    status: { 
        type: DataTypes.ENUM('pending', 'confirmed', 'canceled'), 
        defaultValue: 'pending' 
    },
    discount: { 
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0 
    },
    note: { 
        type: DataTypes.TEXT 
    }
}, {
    tableName: 'bookings',  // Nombre de la tabla
    timestamps: false,      // Desactivar el manejo automático de timestamps
});

// Definición de las relaciones
Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id' });
    Booking.belongsTo(models.Cabin, { foreignKey: 'cabin_id' });
};

module.exports = Booking;
