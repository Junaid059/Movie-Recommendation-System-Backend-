import express from 'express';
import getPersonalizedRecommendations from '../controllers/recommendation.controller';

const router = express.Router();

router.get('/recommendation', getPersonalizedRecommendations);

export default router;
