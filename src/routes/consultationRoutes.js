
import express from 'express';
import { getMedicationRecommendation, getSymptoms } from '../controllers/consultationController.js';
import { saveConsultation, getSharedConsultation } from '../controllers/shareController.js';

const router = express.Router();

router.post('/consultation', getMedicationRecommendation);

router.post('/share', saveConsultation);
router.get('/share/:id', getSharedConsultation);
router.get('/symptoms', getSymptoms);

export default router;