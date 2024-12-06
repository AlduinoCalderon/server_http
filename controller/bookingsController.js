const { response } = require('express');
const { QueryTypes } = require('sequelize');
const sequelize = require('../database/conecta');
const BookingModel = require('../models/booking');
const UserModel = require('../models/user');
const CabinModel = require('../models/cabin');
const emailService = require('../utils/emailService');
const { generateReservationPDF } = require('../services/pdfService');
const moment = require('moment');

// Obtener todas las reservas
const getBookings = async (req, resp = response) => {
    try {
        const bookings = await sequelize.query("SELECT * FROM bookings;", { type: QueryTypes.SELECT });
        resp.json(bookings);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// Obtener una reserva por su ID
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

// Crear una nueva reserva
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

        // Información que se incluirá en el correo
        const bookingInfo = `
        <h2>Confirmación de tu Reserva</h2>
        <p><strong>ID de Reserva:</strong> ${booking.booking_id}</p>
        <p><strong>Usuario:</strong> ${user.first_name} ${user.last_name}</p>
        <p><strong>Cabaña:</strong> ${cabin.name}</p>
        <p><strong>Fecha de Llegada:</strong> ${booking.start_date}</p>
        <p><strong>Fecha de Partida:</strong> ${moment(booking.start_date).add(booking.nights, 'days').format('YYYY-MM-DD')}</p>
        <p><strong>Descuento:</strong> ${booking.discount}%</p>
        <p><strong>Estado:</strong> ${booking.status}</p>
        <p><strong>Notas:</strong> ${booking.note}</p>
        <p><strong>Costo Total:</strong> ${totalCost}</p>
        `;

        // Asunto y cuerpo del correo
        const subject = 'Confirmación de Reserva';
        const text = `Hola ${user.first_name}, te enviamos la confirmación de tu reserva.`;
        const html = `<p>Hola ${user.first_name},</p><p>Te enviamos la confirmación de tu reserva con id: ${booking.booking_id}.</p>${bookingInfo}`;

        // Generar el PDF de la reserva (si es posible)
        let pdfPath = null;
        try {
            pdfPath = generateReservationPDF({
                booking_id: booking.booking_id,
                user_name: `${user.first_name} ${user.last_name}`,
                cabin_name: cabin.name,
                start_date: booking.start_date,
                end_date: moment(booking.start_date).add(booking.nights, 'days').format('YYYY-MM-DD'),
                discount: booking.discount,
                status: booking.status,
                note: booking.note
            });
        } catch (error) {
            console.error('No se pudo generar el PDF:', error);
        }

        // Enviar el correo con el PDF adjunto si existe
        try {
            await emailService.sendEmail({
                to: user.email,
                subject: subject,
                text: text,
                html: html,
                attachments: pdfPath ? [
                    {
                        filename: `reserva_${booking.booking_id}.pdf`,
                        path: pdfPath
                    }
                ] : []
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

// Actualizar una reserva existente
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
        const user = await UserModel.findByPk(booking.user_id, { transaction });
        const cabin = await CabinModel.findByPk(booking.cabin_id, { transaction });

        // Información del correo
        const bookingInfo = `
        <h2>Actualización de tu Reserva</h2>
        <p><strong>ID de Reserva:</strong> ${booking.booking_id}</p>
        <p><strong>Usuario:</strong> ${user.first_name} ${user.last_name}</p>
        <p><strong>Cabaña:</strong> ${cabin.name}</p>
        <p><strong>Fecha de Llegada:</strong> ${booking.start_date}</p>
        <p><strong>Fecha de Partida:</strong> ${moment(booking.start_date).add(booking.nights, 'days').format('YYYY-MM-DD')}</p>
        <p><strong>Descuento:</strong> ${booking.discount}%</p>
        <p><strong>Estado:</strong> ${booking.status}</p>
        <p><strong>Notas:</strong> ${booking.note}</p>
        <p><strong>Costo Total:</strong> ${totalCost}</p>
        `;

        const subject = 'Actualización de Reserva';
        const text = `Hola ${user.first_name}, te enviamos la actualización de tu reserva.`;
        const html = `<p>Hola ${user.first_name},</p><p>Te enviamos la confirmación actualizada de tu reserva con id: ${booking.booking_id}.</p>${bookingInfo}`;

        // Generar el PDF de la reserva actualizada (si es posible)
        let pdfPath = null;
        try {
            pdfPath = generateReservationPDF({
                booking_id: booking.booking_id,
                user_name: `${user.first_name} ${user.last_name}`,
                cabin_name: cabin.name,
                start_date: booking.start_date,
                end_date: moment(booking.start_date).add(booking.nights, 'days').format('YYYY-MM-DD'),
                discount: booking.discount,
                status: booking.status,
                note: booking.note
            });
        } catch (error) {
            console.error('No se pudo generar el PDF:', error);
        }

        // Enviar el correo con el PDF adjunto si existe
        try {
            await emailService.sendEmail({
                to: user.email,
                subject: subject,
                text: text,
                html: html,
                attachments: pdfPath ? [
                    {
                        filename: `reserva_${booking.booking_id}.pdf`,
                        path: pdfPath
                    }
                ] : []
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

// Eliminar una reserva (borrado lógico)
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
