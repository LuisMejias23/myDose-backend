import nodemailer from 'nodemailer';

// 1. Crea el transporter (configuración de envío)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,    // Tu correo de Gmail
        pass: process.env.EMAIL_PASSWORD  // Tu Contraseña de Aplicación (16 caracteres)
    }
});

export const sendRecommendationEmail = async (recipientEmail, aiResponse) => {
    // 2. Define el contenido del correo
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: recipientEmail,
        subject: 'MyDose: Tu Análisis y Recomendación de Síntomas',
        html: `
            <h1>Análisis de Síntomas Pediátricos (Uso Didáctico)</h1>
            <p>Estimado usuario,</p>
            <p>Gracias por usar MyDose. Aquí está el análisis generado por nuestro Asistente de Salud Pediátrico Virtual:</p>
            <div style="border: 1px solid #ccc; padding: 15px; margin: 20px 0;">
                ${aiResponse}
            </div>
            <p>Recuerda: Este análisis es para fines de portafolio y uso didáctico. No sustituye la consulta con un profesional de la salud.</p>
            <p>Saludos cordiales,<br>El equipo MyDose</p>
        `,
    };

    // 3. Envía el correo
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo con Nodemailer:', error);
        return false;
    }
};