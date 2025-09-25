// src/list-models.js


import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

(async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('Conexión exitosa. Modelo gemini-pro listo para usar.');

    // Prueba simple: obtener una respuesta de ejemplo
    const prompt = '¿Cuál es la capital de Francia? Responde solo con el nombre de la ciudad.';
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log('Respuesta de la IA:', text);
  } catch (error) {
    console.error('Error al probar el modelo Gemini:', error);
  }
})();