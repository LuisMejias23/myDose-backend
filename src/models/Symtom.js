import { Schema, model } from "mongoose";

// Este es el sub-esquema para la dosis de cada medicamento
const doseSchema = new Schema({
    type: {
        type: String,
        enum: ['weight', 'fixed', 'topical'], // Añadimos 'topical' para soluciones como el suero salino
        required: true,
    },
    amountPerKg: Number,
    amount: Number,
    maxDose: Number,
});

// Este es el sub-esquema para los rangos de edad
const agesSchema = new Schema({
    min: {
        type: Number,
        required: true,
    },
    max: Number,
});

// Este es el sub-esquema para cada medicamento individual
const medicationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dose: doseSchema,
    ages: agesSchema,
    recommendations: {
        type: String,
        required: true,
    },
}, { _id: false }); // Esto evita que Mongoose cree un _id para cada medicamento anidado

// Este es el esquema principal que engloba a los demás
const symptomSchema = new Schema({
    symptom: {
        type: String,
        required: true,
        unique: true, // Esto asegura que no haya síntomas duplicados
    },
    requiredTemperature: {
        type: Number,
        default: null, // Campo opcional para síntomas como la fiebre
    },
    medications: [medicationSchema], // Un array de medicamentos anidados
});

const Symptom = model('Symptom', symptomSchema);
export default Symptom;