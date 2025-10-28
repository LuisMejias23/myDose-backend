// myDose-backend/server.js (o archivo principal de Express)

import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import consultationRoutes from './routes/consultationRoutes.js';
import admin from 'firebase-admin';
import { createRequire } from 'node:module';
import notificationRoutes from './routes/notificationRoutes.js';
import authRoutes from './routes/authRoutes.js';

const require = createRequire(import.meta.url);

connectDB();

const app = express();
const port = 3000;


const allowedOrigins = [
  'https://bandboxical-berneice-nonincarnated.ngrok-free.dev', // backend
  'https://8x5opdftrvsm.share.zrok.io' // frontend (Zrok)
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});



app.use(express.json());

const serviceAccount = require('../config/mydose-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use('/api/notifications', notificationRoutes);
app.use('/api', consultationRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the MyDose API!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});