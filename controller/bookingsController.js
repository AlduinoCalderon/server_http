const { response } = require("express");
const BookingModel = require('../models/booking');
const { QueryTypes } = require('sequelize');
const pdfService = require('../services/pdfService');  // Importa el servicio de PDF
const emailService = require('../utils/emailService');  // Importa el servicio de correo
const moment = require('moment');
const UserModel = require('../models/user');
const CabinModel = require('../models/cabin');


const getBookings = async (req, resp = response) => {
    const bookings = await BookingModel.sequelize.query("SELECT * FROM bookings;", { type: QueryTypes.SELECT });
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
/*
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
*/
const postBooking = async (req, resp = response) => {
    const { body } = req;
    try {
        // Crear la reserva
        const booking = await BookingModel.create(body);

        // Obtener la cabina seleccionada y calcular el costo total
        const selectedCabin = await CabinModel.findByPk(body.cabin_id);
        const totalCost = (selectedCabin.cost_per_night * body.nights)-body.discount;
        await booking.update({ total_cost: totalCost });

        // Generar el PDF de la reserva
        const pdfPath = pdfService.generateReservationPDF(booking);

        // Enviar el correo con el PDF adjunto
        const user = await UserModel.findByPk(booking.user_id);
        const subject = 'Confirmación de Reserva';
        const text = 'Adjuntamos la confirmación de tu reserva.';
        const html = `<p>Hola ${user.first_name},</p><p>Te enviamos la confirmación de tu reserva.</p>`;
        
        // Enviar el correo con el archivo PDF adjunto
        await emailService.sendEmail({
            to: user.email,
            subject: subject,
            text: text,
            html: html,
            attachments: [
                {
                    filename: `reserva_${booking.booking_id}.pdf`,
                    path: pdfPath
                }
            ]
        });

        resp.json({
            mensaje: "Reserva creada y correo enviado exitosamente.",
            Booking: booking
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};
/*
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
*/
const putBooking = async (req, resp = response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const booking = await BookingModel.findByPk(id);
        if (booking == null) {
            return resp.status(404).json({
                mensaje: "No se encuentra el registro"
            });
        }
        await booking.update(body);

        // Calcular el costo total de la reserva
        const selectedCabin = await CabinModel.findByPk(body.cabin_id);
        const totalCost = selectedCabin.cost_per_night * body.nights;
        await booking.update({ total_cost: totalCost });

        // Generar el PDF de la reserva actualizada
        const pdfPath = pdfService.generateReservationPDF(booking);

        // Enviar el correo con el PDF adjunto
        const user = await UserModel.findByPk(booking.user_id);
        const subject = 'Actualización de Reserva';
        const text = 'Te enviamos la actualización de tu reserva.';
        const html = `<p>Hola ${user.first_name},</p><p>Te enviamos la confirmación actualizada de tu reserva.</p>`;

        // Enviar el correo con el archivo PDF adjunto
        await emailService.sendEmail({
            to: user.email,
            subject: subject,
            text: text,
            html: html,
            attachments: [
                {
                    filename: `reserva_${booking.booking_id}.pdf`,
                    path: pdfPath
                }
            ]
        });

        resp.json({
            mensaje: "Reserva actualizada y correo enviado exitosamente.",
            Booking: booking
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};


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
