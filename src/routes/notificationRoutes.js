import { Router } from "express";
import admin from "firebase-admin";
import Subscription from "../models/Subscription.js";
import webpush from 'web-push';

const router = Router();
const VAPID_PUBLIC_KEY = 'BKdYML7XIbaVNKRK-WjSnH_gJcL0oKCRhcP6q74OmQnqGsaFLwkBd4aY2yHKIP1zYXsQVM6GcOTaVb_XCpXbtDY'; 
const VAPID_PRIVATE_KEY = 'OSnXi2r0EjJsjyQYAcyDng3OUqXDnShiIx4VsKDGrOk'

webpush.setVapidDetails(
    'mailto:loiscool1234@gmail.com', // Un email de contacto (puede ser ficticio)
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

router.post("/save-subscription", async (req, res) => {
  // 🛑 Hacer la función ASYNC
  const subscriptionData = req.body;

  if (!subscriptionData || !subscriptionData.endpoint) {
    return res
      .status(400)
      .json({ message: "Objeto de suscripción no válido." });
  }

  try {
    // 1. Desestructurar las claves del objeto
    const { endpoint, keys } = subscriptionData;

    // 2. Crear una nueva instancia del modelo de Mongoose
    const newSubscription = new Subscription({
      endpoint: endpoint,
      p256dh: keys.p256dh, // Mapear a los campos de tu esquema
      auth: keys.auth, // Mapear a los campos de tu esquema
    });

    await newSubscription.save();

    console.log("✅ Suscripción guardada en MongoDB:", endpoint);
    res.status(201).json({ message: "Suscripción registrada y guardada." });
  } catch (error) {
    console.error(
      "🛑 ERROR AL GUARDAR LA SUSCRIPCIÓN EN MONGODB:",
      error.message
    );

    if (error.code === 11000) {
      return res
        .status(200)
        .json({ message: "Suscripción ya existía. Actualización omitida." });
    }

    res
      .status(500)
      .json({ error: "Fallo al guardar la suscripción en la Base de Datos." });
  }
});

// --------------------------------------------------------------------
// B) ENDPOINT DE ENVÍO DE PRUEBA: Tú llamas a esta ruta para disparar la notificación
// --------------------------------------------------------------------

// En tu router de notificaciones:

router.get('/send-test-notification', async (req, res) => {
  try {
    const subscriptionRecord = await Subscription.findOne().sort({ createDate: -1 });

    if (!subscriptionRecord) {
        return res.status(404).json({ message: '❌ No hay suscripciones guardadas en la Base de Datos.' });
    }

    // 1. CONSTRUIR EL OBJETO PUSHSUBSCRIPTION COMPLETO
    // web-push necesita el formato exacto del objeto guardado en MongoDB
    const pushSubscription = {
      endpoint: subscriptionRecord.endpoint,
      keys: {
        auth: subscriptionRecord.auth,
        p256dh: subscriptionRecord.p256dh,
      }
    };
    
    // 2. CONSTRUIR EL PAYLOAD (el contenido del mensaje)
    // El payload debe ser una cadena JSON para ser enviado
    const payload = JSON.stringify({
      title: '🩺 MyDose: Notificación de Prueba',
      body: '¡La notificación ha llegado usando VAPID y web-push!',
      icon: '/assets/icons/icon-72x72.png', // Opcional, pero bueno para la UX
    });

    // 3. 🚀 ENVIAR USANDO WEB-PUSH
    const response = await webpush.sendNotification(
        pushSubscription, 
        payload
    );
    
    console.log('🚀 Notificación enviada con éxito (web-push):', response);
    res.status(200).json({ success: true, message: 'Notificación enviada.', webpushResponse: response });

  } catch (error) {
    console.error('❌ Error al enviar la notificación (web-push):', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; 
