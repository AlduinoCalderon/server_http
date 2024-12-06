const { response } = require('express');
const { QueryTypes } = require('sequelize');
const sequelize = require('../database/conecta');
const BookingModel = require('../models/booking');
const UserModel = require('../models/user');
const CabinModel = require('../models/cabin');
const emailService = require('../utils/emailService');
const { generateReservationPDF } = require('../utils/pdfService');
const moment = require('moment');

const getBookings = async (req, resp = response) => {
    try {
        const bookings = await sequelize.query("SELECT * FROM bookings;", { type: QueryTypes.SELECT });
        resp.json(bookings);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};

const getBooking = async (req, resp = response) => {
    const id = req.params.id;
    try {
        const booking = await BookingModel.findByPk(id);
        if (!booking) {
            resp.status(404).json({ respuesta: false, resultado: "No se encuentra" });
        } else {
            resp.json({ respuesta: true, resultado: booking });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};

const postBooking = async (req, resp = response) => {
    const { body } = req;
    const transaction = await sequelize.transaction();
    try {
        // Crear la reserva
        const booking = await BookingModel.create(body, { transaction });

        // Obtener la cabina seleccionada y calcular el costo total
        const selectedCabin = await CabinModel.findByPk(body.cabin_id, { transaction });
        const totalCost = (selectedCabin.cost_per_night * body.nights) - body.discount;
        await booking.update({ total_cost: totalCost }, { transaction });

        await transaction.commit();

        // Obtener la información del usuario y la cabina
        const user = await UserModel.findByPk(booking.user_id);
        const cabin = await CabinModel.findByPk(booking.cabin_id);

        // Generar el PDF de la reserva
        const pdfPath = generateReservationPDF({
            booking_id: booking.booking_id,
            user_name: `${user.first_name} ${user.last_name}`,
            cabin_name: cabin.name,
            start_date: booking.start_date,
            end_date: moment(booking.start_date).add(booking.nights, 'days').format('YYYY-MM-DD'),
            discount: booking.discount,
            status: booking.status,
            note: booking.note
        });

        // Enviar el correo de confirmación de la reserva con el PDF adjunto
        const subject = 'Confirmación de Reserva';
        const text = `Hola ${user.first_name}, te enviamos la confirmación de tu reserva.`;
        const html = `<p>Hola ${user.first_name},</p><p>Te enviamos la confirmación de tu reserva.</p>`;

        try {
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
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }

        resp.json({ mensaje: "Reserva creada exitosamente.", Booking: booking });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};

const putBooking = async (req, resp = response) => {
    const { id } = req.params;
    const { body } = req;
    const transaction = await sequelize.transaction();
    try {
        const booking = await BookingModel.findByPk(id, { transaction });
        if (!booking) {
            await transaction.rollback();
            return resp.status(404).json({ mensaje: "No se encuentra el registro" });
        }

        await booking.update(body, { transaction });

        // Calcular el costo total de la reserva
        const selectedCabin = await CabinModel.findByPk(body.cabin_id, { transaction });
        const totalCost = (selectedCabin.cost_per_night * body.nights) - body.discount;
        await booking.update({ total_cost: totalCost }, { transaction });

        await transaction.commit();

        // Obtener la información del usuario y la cabina
        const user = await UserModel.findByPk(booking.user_id);
        const cabin = await CabinModel.findByPk(booking.cabin_id);

        // Generar el PDF de la reserva actualizada
        const pdfPath = generateReservationPDF({
            booking_id: booking.booking_id,
            user_name: `${user.first_name} ${user.last_name}`,
            cabin_name: cabin.name,
            start_date: booking.start_date,
            end_date: moment(booking.start_date).add(booking.nights, 'days').format('YYYY-MM-DD'),
            discount: booking.discount,
            status: booking.status,
            note: booking.note
        });

        // Enviar el correo de actualización de la reserva con el PDF adjunto
        const subject = 'Actualización de Reserva';
        const text = `Hola ${user.first_name}, te enviamos la actualización de tu reserva.`;
        const html = `<p>Hola ${user.first_name},</p><p>Te enviamos la confirmación actualizada de tu reserva.</p>`;

        try {
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
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }

        resp.json({ mensaje: "Reserva actualizada exitosamente.", Booking: booking });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};

const deleteBooking = async (req, resp = response) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const booking = await BookingModel.findByPk(id, { transaction });
        if (!booking) {
            await transaction.rollback();
            return resp.status(404).json({ mensaje: "Registro no encontrado" });
        }

        await booking.update({ is_active: false }, { transaction });

        await transaction.commit();
        resp.json({ mensaje: "Registro eliminado" });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};

module.exports = {
    getBookings,
    getBooking,
    postBooking,
    putBooking,
    deleteBooking
};
