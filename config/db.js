import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('La variable de entorno MONGO_URI no está definida.');
    }

    await mongoose.connect(mongoUri);
    console.log('Jefe, ¡conexión a MongoDB establecida!');

  } catch (error) {
    console.error('Jefe, no se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

export default connectDB;