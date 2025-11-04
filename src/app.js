import express from "express";
import cors from "cors"; // ⬅️ Nuevo import
import connectDB from "../config/db.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import admin from "firebase-admin";
import { createRequire } from "node:module";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import fs from "fs";

const require = createRequire(import.meta.url);

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// -------------------------------------------------------------
// 1. CONFIGURACIÓN CORS (Usando el módulo 'cors')
// -------------------------------------------------------------

const allowedOrigins = [
  "https://my-dose-frontend.vercel.app",
  "https://mydose-api.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (same-origin, Postman, o peticiones de herramientas)
      if (!origin) return callback(null, true);

      // Permitir orígenes en la lista
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Rechazar otros orígenes
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// -------------------------------------------------------------
// 2. MIDDLEWARES PRINCIPALES
// -------------------------------------------------------------

app.use(express.json());

// 🛑 INICIALIZACIÓN SEGURA DE FIREBASE ADMIN SDK
const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH;

if (serviceAccountPath) {
  try {
    // Leer el contenido del archivo JSON desde la ruta de Render
    const serviceAccountContent = fs.readFileSync(serviceAccountPath, "utf8");
    const serviceAccount = JSON.parse(serviceAccountContent);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log(
      "✅ Firebase Admin SDK inicializado desde el Archivo Secreto de Render."
    );
  } catch (error) {
    console.error(
      "❌ ERROR al inicializar Firebase Admin SDK desde el Archivo Secreto:",
      error
    );
  }
} else {
  console.error(
    "❌ ERROR: La variable FIREBASE_CREDENTIALS_PATH no está configurada. Verifique las variables de entorno en Render."
  );
}

app.use("/api/notifications", notificationRoutes);
app.use("/api", consultationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", emailRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error("❌ ERROR GLOBAL NO CAPTURADO:", err.stack);

  // Asegura que SIEMPRE se envía una respuesta JSON en caso de error 500
  res.status(err.statusCode || 500).json({
    message: err.message || "Error Interno del Servidor (JSON)",
    status: err.statusCode || 500,
  });
});
// -------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
