const Payment = require('../models/payment');

// Obtener todos los pagos
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({ where: { is_active: true } });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos', error });
    }
};

// Obtener un pago por ID
const getPayment = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pago', error });
    }
};

// Crear un nuevo pago
const postPayment = async (req, res) => {
    const { booking_id, amount, payment_method, is_active } = req.body;
    try {
        const newPayment = await Payment.create({
            booking_id,
            amount,
            payment_method,
            is_active
        });
        res.json(newPayment);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pago', error });
    }
};

// Actualizar un pago por ID
const putPayment = async (req, res) => {
    const { id } = req.params;
    const { booking_id, amount, payment_method, is_active } = req.body;
    try {
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        await payment.update({ booking_id, amount, payment_method, is_active });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pago', error });
    }
};

// Eliminar un pago por ID (Borrado lógico)
const deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.findByPk(id);
        if (!payment || !payment.is_active) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        await payment.update({ is_active: false });
        res.json({ message: 'Pago eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pago', error });
    }
};

module.exports = {
    getPayments,
    getPayment,
    postPayment,
    putPayment,
    deletePayment
};
