const nodemailer = require('nodemailer');
const { response } = require("express");

// Crear un transporte de correo utilizando las credenciales de tu servicio (en este caso, Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Puedes usar otro servicio de correo si prefieres
    auth: {
        user: process.env.EMAIL_USER,  // Tu email
        pass: process.env.EMAIL_PASS   // Tu contraseña
    }
});

// Función para enviar un correo
const sendEmail = async (req, resp = response) => {
    const { to, subject, text, html } = req.body;

    // Configura las opciones del correo electrónico
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Correo desde el cual se enviará el mensaje
        to,                           // Correo de destino
        subject,                      // Asunto del correo
        text,                         // Cuerpo del correo en texto plano
        html                          // Cuerpo del correo en formato HTML (opcional)
    };

    try {
        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);

        // Respuesta si el correo fue enviado correctamente
        resp.json({
            message: "Correo enviado exitosamente",
            info: info.response
        });
    } catch (error) {
        // Manejar errores si ocurre algo
        console.error(error);
        resp.status(500).json({
            message: "Error al enviar el correo",
            error: error.message
        });
    }
};

module.exports = { sendEmail };
