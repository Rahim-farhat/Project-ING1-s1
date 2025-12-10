import express from 'express';
import { generateCV } from '../controllers/cvController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateCV);

export default router;
