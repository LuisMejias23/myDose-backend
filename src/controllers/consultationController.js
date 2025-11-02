import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
import Symptom from "../models/Symtom.js"; 
// 🛑 IMPORTAR EL SERVICIO DE EMAIL AQUÍ
import { sendRecommendationEmail } from '../services/emailService.js'; 

// Inicialización de la IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getSymptoms = async (req, res) => { 
  try {
    const symptoms = await Symptom.find({});
    const symptomsList = symptoms.map(item => item.symptom);
    res.json(symptomsList);
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// Nueva función para listar modelos disponibles (se mantiene)
export const listAvailableModels = async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.status(200).json(models);
  } catch (error) {
    console.error("Error al listar modelos disponibles:", error);
    res.status(500).json({ error: "No se pudieron obtener los modelos disponibles." });
  }
};

// @desc    Get AI-generated consultation response and optionally send email
// @route   POST /api/consultation (o /api/process-consultation)
export const getConsultationResponse = async (req, res) => {
  // 🛑 DESESTRUCTURAR email y sendEmail
  const { symptom, age, weight, temperature, email, sendEmail } = req.body;
  let aiResponseText = '';
  let emailSent = false; 

  try {
    // 1. GENERACIÓN DE RESPUESTA DE LA IA
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); 

    const systemPrompt = `
    Eres un asistente de salud pediátrico virtual. Tu único trabajo es proporcionar una respuesta en un formato conversacional. No des nombres de medicamentos, dosis o un plan de tratamiento específico. Siempre debes incluir una advertencia clara al final de tu respuesta que diga: "Esto es solo una guía general. Consulta siempre a un médico para un diagnóstico y tratamiento precisos." Tu respuesta debe ser empática, concisa y útil, en español.
    `;

    const userPrompt = `
      Basado en la siguiente información, por favor, dame una respuesta clara y concisa.
      Síntoma: ${symptom}
      Edad: ${age} meses
      Peso: ${weight} kg
      Temperatura: ${temperature || 'No especificada'}
    `;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    aiResponseText = result.response.text();

  } catch (error) {
    // Si falla la IA, respondemos con el error y terminamos la ejecución
    if (error.status === 404) {
      console.error("Modelo no encontrado. Verifica el nombre del modelo.");
    } else {
      console.error('Error al obtener la respuesta de la IA:', error);
    }
    return res.status(500).json({ error: 'Fallo al obtener la respuesta de la IA.' });
  }

  // 2. LÓGICA DE ENVÍO DE EMAIL (solo si el frontend lo solicita)
  if (sendEmail === true) {
    try {
      // 🛑 LLAMAR AL SERVICIO DE EMAIL
      const result = await sendRecommendationEmail(email, aiResponseText);
      emailSent = result; // Debería ser true si se envió
      console.log(`Email intentado para ${email}. Éxito: ${emailSent}`);
      
    } catch (emailError) {
      // 🛑 ESTO CAPTURA EL ERROR DE AUTHENTICATION DE NODEMAILER Y LO IMPRIME
      console.error('🛑 ERROR DE NODEMAILER/AUTENTICACIÓN:', emailError);
      emailSent = false;
    }
  }

  // 3. RESPUESTA FINAL AL FRONTEND
  // Incluimos la respuesta de la IA y el estado del email
  res.status(200).json({ 
    aiResponse: aiResponseText,
    emailSent: emailSent // Le dice al frontend si el envío fue exitoso o falló
  });
};