
import express from "express";
import cors from "cors"; // ⬅️ Nuevo import
import connectDB from "../config/db.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import admin from "firebase-admin";
import { createRequire } from "node:module";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const require = createRequire(import.meta.url);

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// -------------------------------------------------------------
// 1. CONFIGURACIÓN CORS (Usando el módulo 'cors')
// -------------------------------------------------------------

const allowedOrigins = [
  "https://mi-app-mydose-temporal.vercel.app",
  "https://bandboxical-berneice-nonincarnated.ngrok-free.dev", 
];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (same-origin, Postman, o peticiones de herramientas)
        if (!origin) return callback(null, true); 
        
        // Permitir orígenes en la lista
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Rechazar otros orígenes
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false, 
    optionsSuccessStatus: 204
}));

// -------------------------------------------------------------
// 2. MIDDLEWARES PRINCIPALES
// -------------------------------------------------------------

app.use(express.json());

const serviceAccount = require("../mydose-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// -------------------------------------------------------------
// 3. MONTAJE DE RUTAS
// -------------------------------------------------------------

app.use("/api/notifications", notificationRoutes);
app.use("/api", consultationRoutes);
app.use("/api/auth", authRoutes);

// La ruta raíz fue comentada o eliminada para el pooling:
/* app.get("/", (req, res) => {
  res.send("Welcome to the MyDose API!");
}); */

// -------------------------------------------------------------
// 4. MIDDLEWARE DE MANEJO DE ERRORES (Al final de todas las rutas)
// -------------------------------------------------------------

// A) Manejo de Rutas No Encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// B) Middleware Global de Manejo de Errores (500)
// Esto garantiza que cualquier error de servidor NO devuelva HTML
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    
    console.error("❌ ERROR GLOBAL NO CAPTURADO:", err.stack); 
    
    // Asegura que SIEMPRE se envía una respuesta JSON en caso de error 500
    res.status(err.statusCode || 500).json({
        message: err.message || 'Error Interno del Servidor (JSON)',
        status: err.statusCode || 500
    });
});
// -------------------------------------------------------------


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});