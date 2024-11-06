const { response } = require("express");
const BookingModel = require('../models/booking');
const { QueryTypes } = require('sequelize');

const getBookings = async (req, resp = response) => {
    const bookings = await BookingModel.sequelize.query("SELECT * FROM bookings WHERE is_active = true", { type: QueryTypes.SELECT });
    resp.json(bookings);
}

const getBooking = async (req, resp = response) => {
    const id = req.params.id;
    const booking = await BookingModel.findByPk(id);
    if (booking==null) {
        resp.json({
            respuesta: false,
            resultado: "No se encuentra"
        });
    } else {
        resp.json({
            respuesta: true,
            resultado: booking
        });
    }
}

const postBooking = async (req, resp = response) => {
    const { body } = req;
    try {
        const booking = await BookingModel.create(body);
        resp.json({
            Mensaje: "Inserción realizada.",
            Booking: booking
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
}

const putBooking = async (req, resp = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const booking = await BookingModel.findByPk(id);
        if (booking==null) {
            return resp.status(404).json({
                mensaje: "No se encuentra el registro"
            });
        }
        await booking.update(body);
        resp.json(booking);
    } catch (error) {
        console.log(error);
    }
}

const deleteBooking = async (req, resp = response) => {
    const { id } = req.params;
    try {
        const booking = await BookingModel.findByPk(id);
        if (booking ==null) {
            return resp.status(404).json({
                mensaje: "Registro no encontrado"
            });
        }
        await booking.update({ is_active: false });
        resp.json({
            mensaje: "Registro eliminado"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getBookings,
    getBooking,
    postBooking,
    putBooking,
    deleteBooking
}
