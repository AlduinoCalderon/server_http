const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs'); // Agrega esta línea para importar el módulo fs

// Generar el PDF de la reserva
function generateReservationPDF(reserva) {
  const doc = new PDFDocument();

  const pdfPath = path.join(__dirname, '..', '..', 'reservas', `${reserva.booking_id}.pdf`);
  doc.pipe(fs.createWriteStream(pdfPath)); // Ahora 'fs' está definido

  // Título
  doc.fontSize(25).text('Confirmación de Reserva', { align: 'center' });

  // Información de la reserva
  doc.moveDown();
  doc.fontSize(18).text(`ID de Reserva: ${reserva.booking_id}`);
  doc.text(`Usuario: ${reserva.user_name}`);
  doc.text(`Cabaña: ${reserva.cabin_name}`);
  doc.text(`Fecha de Llegada: ${reserva.start_date}`);
  doc.text(`Fecha de Partida: ${reserva.end_date}`);
  doc.text(`Descuento: ${reserva.discount}%`);
  doc.text(`Estado: ${reserva.status}`);
  doc.text(`Notas: ${reserva.note}`);

  // Guardar el archivo PDF
  doc.end();

  return pdfPath;  // Devolvemos la ruta para usarla luego en el envío de correos o WhatsApp
}

module.exports = { generateReservationPDF };
