// src/seed.js
import connectDB from '../config/db.js';
import Symtom from './models/Symtom.js';
import pediatricMedicines from './data/pediatricMedicines.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDB = async () => {
  try {
    await connectDB();

    // Eliminar datos existentes (opcional, para evitar duplicados)
    await Symtom.deleteMany({});
    console.log('Jefe, ¡datos de medicamentos anteriores eliminados!');

    // Insertar los nuevos datos
    await Symtom.insertMany(pediatricMedicines);
    console.log('Jefe, ¡datos de medicamentos insertados exitosamente!');

    process.exit(0);
  } catch (error) {
    console.error('Jefe, ocurrió un error al insertar los datos:', error);
    process.exit(1);
  }
};

seedDB(); 