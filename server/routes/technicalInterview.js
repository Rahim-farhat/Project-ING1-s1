import express from 'express';
import { getTechnicalQuestions } from '../controllers/technicalInterviewController.js';

const router = express.Router();

router.post('/', getTechnicalQuestions);

export default router;
