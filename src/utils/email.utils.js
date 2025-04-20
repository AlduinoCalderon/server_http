const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const msg = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Verifica tu correo electrónico',
        html: `
            <h1>Bienvenido a nuestra plataforma</h1>
            <p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
            <a href="${verificationUrl}">Verificar correo electrónico</a>
            <p>Si no has creado una cuenta, puedes ignorar este correo.</p>
        `
    };

    try {
        await sgMail.send(msg);
        console.log('Correo de verificación enviado exitosamente');
        return true;
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        return false;
    }
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const msg = {
        to: email,
        from: process.env.EMAIL_USER,
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
        console.log('Correo de restablecimiento de contraseña enviado exitosamente');
        return true;
    } catch (error) {
        console.error('Error al enviar el correo de restablecimiento:', error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}; 