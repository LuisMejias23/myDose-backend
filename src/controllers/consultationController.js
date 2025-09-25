import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
import Symptom from "../models/Symtom.js"; 

export const getSymptoms = async (req, res) => { // <-- Se hizo asíncrona
  try {
   
    const symptoms = await Symptom.find({});
    // Mapear los resultados para obtener solo el nombre del síntoma
    const symptomsList = symptoms.map(item => item.symptom);
    res.json(symptomsList);
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get AI-generated consultation response
// @route   POST /api/consultation
export const getConsultationResponse = async (req, res) => {
  const { symptom, age, weight, temperature } = req.body;

  try {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); 

    // Prompt del sistema
   const systemPrompt = `
    Eres un asistente de salud pediátrico virtual. Tu único trabajo es proporcionar una respuesta en un formato conversacional. No des nombres de medicamentos, dosis o un plan de tratamiento específico. Siempre debes incluir una advertencia clara al final de tu respuesta que diga: "Esto es solo una guía general. Consulta siempre a un médico para un diagnóstico y tratamiento precisos." Tu respuesta debe ser empática, concisa y útil, en español.
  `;

    // Prompt del usuario basado en los datos de la consulta
    const userPrompt = `
      Basado en la siguiente información, por favor, dame una respuesta clara y concisa.
      Síntoma: ${symptom}
      Edad: ${age} meses
      Peso: ${weight} kg
      Temperatura: ${temperature || 'No especificada'}
    `;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    res.status(200).json({ aiResponse: text });
  } catch (error) {
    console.error('Error al obtener la respuesta de la IA:', error);
    res.status(500).json({ error: 'Fallo al obtener la respuesta de la IA.' });
  }
};