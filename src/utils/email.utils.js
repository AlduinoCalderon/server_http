const sgMail = require('@sendgrid/mail');

// Verificar que la API key esté configurada
if (!process.env.SENDGRID_API_KEY) {
    console.error('[EMAIL] Error: SENDGRID_API_KEY no está configurada en las variables de entorno');
}

// Verificar que el email del remitente esté configurado
if (!process.env.EMAIL_FROM) {
    console.error('[EMAIL] Error: EMAIL_FROM no está configurado en las variables de entorno');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        templateId: 'd-acb1046415524009a88be06ea3d9b091',
        dynamicTemplateData: {
            verificationUrl
        }
    };

    try {
        await sgMail.send(msg);
        console.log(`[EMAIL] Correo de verificación enviado exitosamente a: ${email}`);
        return true;
    } catch (error) {
        console.error(`[EMAIL] Error al enviar el correo de verificación a ${email}:`, {
            message: error.message,
            code: error.code,
            response: error.response?.body
        });
        return false;
    }
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Restablece tu contraseña',
        html: `
            <h1>Restablecimiento de contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetUrl}">Restablecer contraseña</a>
            <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
        `
    };

    try {
        await sgMail.send(msg);
        console.log(`[EMAIL] Correo de restablecimiento enviado exitosamente a: ${email}`);
        return true;
    } catch (error) {
        console.error(`[EMAIL] Error al enviar el correo de restablecimiento a ${email}:`, {
            message: error.message,
            code: error.code,
            response: error.response?.body
        });
        return false;
    }
};

const sendBookingConfirmationEmail = async (email, bookingInfo, isUpdate = false) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
        templateId: 'd-efba084a8c8a4927a2a3835de9237ee4',
        dynamicTemplateData: {
            ...bookingInfo,
            subject: isUpdate ? 'Actualización de Reserva' : 'Confirmación de Reserva'
        }
    };

    try {
        await sgMail.send(msg);
        console.log(`[EMAIL] Correo de ${isUpdate ? 'actualización' : 'confirmación'} de reserva enviado exitosamente a: ${email}`);
        return true;
    } catch (error) {
        console.error(`[EMAIL] Error al enviar el correo de ${isUpdate ? 'actualización' : 'confirmación'} de reserva a ${email}:`, {
            message: error.message,
            code: error.code,
            response: error.response?.body
        });
        return false;
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendBookingConfirmationEmail
}; 