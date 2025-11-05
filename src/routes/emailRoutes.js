import { Router } from 'express';
import { sendRecommendationContent } from '../controllers/emailController.js';

const router = Router();

router.post('/send-recommendation-content', sendRecommendationContent);

export default router;