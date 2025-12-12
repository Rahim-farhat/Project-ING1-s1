import express from 'express';
import { generateCV, getCVs, saveGeneratedCV } from '../controllers/cvController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getCVs);

router.post('/generate', authMiddleware, generateCV);

router.post('/save', authMiddleware, saveGeneratedCV);

export default router;