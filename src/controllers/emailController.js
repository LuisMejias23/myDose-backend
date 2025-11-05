import { sendRecommendationContent } from '../services/emailService.js';

export const getEmailResponse = async (req, res) => {
  const { recommendationText, to } = req.body;

   if (!subject || !body || !to) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios (subject, body, to).' });
    }
  
    try {
        const success = await sendRecommendationContent(to, recommendationText);

        if (success) {
            return res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });
        } else {
            return res.status(500).json({ success: false, message: 'Error interno al enviar el correo.' });
        }
    } catch (error) {
        console.error('Error en sendRecommendationContent:', error);
        return res.status(500).json({ success: false, message: 'Error del servidor al procesar la solicitud.' });
    }
};
