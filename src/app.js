import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import consultationRoutes from './routes/consultationRoutes.js';
import authRoutes from './routes/authRoutes.js';


connectDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
// Usamos el enrutador para manejar las rutas
app.use('/api', consultationRoutes);
app.use('/api/auth', authRoutes);



app.get('/', (req, res) => {
    res.send('Welcome to the MyDose API!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});