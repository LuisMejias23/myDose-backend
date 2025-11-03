import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, html) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'MyDose <noreply@mydose.app>',
      to,
      subject,
      html,
    });

    if (error) throw error;
    console.log('Correo enviado correctamente:', data);
  } catch (err) {
    console.error('Error al enviar el correo:', err);
  }
}
