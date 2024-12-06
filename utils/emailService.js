const nodemailer = require('nodemailer');

// Crear el transportador (transporter) usando las credenciales de tu servicio de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Puedes usar otro servicio de correo si prefieres
    auth: {
        user: process.env.EMAIL_USER,  // Tu email
        pass: process.env.EMAIL_PASS   // Tu contraseña
    }
});

// Función para enviar un correo
const sendEmail = async ({ to, subject, text, html }) => {
    // Definir el mensaje
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
        console.log(`Correo enviado: ${info.response}`);
    } catch (error) {
        // Manejar errores si ocurre algo
        console.error(`Error al enviar el correo: ${error.message}`);
        throw new Error(`Error al enviar el correo: ${error.message}`);
    }
};

module.exports = { sendEmail };
