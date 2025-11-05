//import nodemailer from 'nodemailer';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendRecommendationEmail = async (
  recipientEmail,
  aiResponseText
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "MyDose <onboarding@resend.dev>",
      to: recipientEmail,
      subject: "Recomendación de tu consulta médica virtual",
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
      console.error("❌ Error al enviar el correo con Resend:", error);
      return false;
    }

    console.log("✅ Correo enviado correctamente:", data);
    return true;
  } catch (err) {
    console.error("❌ Error general al usar Resend:", err);
    return false;
  }
};

export const sendRecommendationContent = async (recipientEmail, aiResponseText) => {
  const FROM_EMAIL = "MyDose <onboarding@resend.dev>";

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: "Recomendación de tu consulta médica virtual",

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
      console.error(
        "❌ Error al enviar el correo de compartir con Resend:",
        error
      );
      return false;
    }

    console.log("✅ Correo de compartir enviado correctamente:", data);
    return true;
  } catch (err) {
    console.error("❌ Error general al usar Resend para compartir:", err);
    return false;
  }
};
