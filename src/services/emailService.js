//import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendRecommendationEmail = async (to, aiResponseText) => {
 try {
    const { data, error } = await resend.emails.send({
      from: 'MyDose <onboarding@resend.dev>',
      to,
      subject: 'Recomendación de tu consulta médica virtual',
      html: `
         <h1>Análisis de Síntomas Pediátricos (Uso Didáctico)</h1>
            <p>Estimado usuario,</p>
            <p>Gracias por usar MyDose. Aquí está el análisis generado por nuestro Asistente de Salud Pediátrico Virtual:</p>
            <div style="border: 1px solid #ccc; padding: 15px; margin: 20px 0;">
                ${aiResponseText}
            </div>
            <p>Recuerda: Este análisis es para fines de portafolio y uso didáctico. No sustituye la consulta con un profesional de la salud.</p>
            <p>Saludos cordiales,<br>El equipo MyDose</p>
      `,
    });

    if (error) {
      console.error('❌ Error al enviar el correo con Resend:', error);
      return false;
    }

    console.log('✅ Correo enviado correctamente:', data);
    return true;
  } catch (err) {
    console.error('❌ Error general al usar Resend:', err);
    return false;
  }
   
};



/*  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    requireTLS: true, 
    auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASSWORD 
    }
});
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
    } */