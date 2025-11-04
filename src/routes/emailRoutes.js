import express from 'express';
import { sendEmail } from '../controllers/emailController.js';

const router = express.Router();

// Ruta para enviar correos electrónicos
router.post('/send-email', sendEmail);

export default router;