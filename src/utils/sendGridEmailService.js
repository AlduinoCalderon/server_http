const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, templateId, dynamicTemplateData }) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM, // Tu correo verificado en SendGrid
    templateId, // El ID de la plantilla que creaste en SendGrid
    dynamic_template_data: dynamicTemplateData, // Los datos que quieres pasar a la plantilla
  };

  try {
    await sgMail.send(msg);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = { sendEmail };
