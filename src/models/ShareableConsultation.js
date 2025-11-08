// src/models/ShareableConsultation.js

import mongoose from 'mongoose';

const ShareableConsultationSchema = new mongoose.Schema({
    symptom: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    temperature: Number,
    recommendations: {
        type: Array,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d', 
    },
});

const ShareableConsultation = mongoose.model('ShareableConsultation', ShareableConsultationSchema);

export default ShareableConsultation;