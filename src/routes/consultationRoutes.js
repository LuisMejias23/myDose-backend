import express from 'express';
import { getConsultationResponse } from '../controllers/consultationController.js';
import { getSymptoms } from '../controllers/consultationController.js';
import { saveConsultation } from '../controllers/shareController.js';

const router = express.Router();

router.post('/consultation', getConsultationResponse); 
router.get('/symptoms', getSymptoms); 
router.post('/share', saveConsultation);

export default router;

