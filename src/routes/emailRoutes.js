import { Router } from 'express';
import { sendRecommendationContentController } from '../controllers/emailController.js';

const router = Router();

router.post('/send-recommendation-content', sendRecommendationContentController);

export default router;