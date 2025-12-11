import express from 'express';
import {
    getCVs,
    getCVById,
    createCV,
    updateCV,
    setDefaultCV,
    deleteCV,
    downloadCV,
    getCVStats
} from '../controllers/cvController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.get('/cvs', authMiddleware, getCVs);
router.get('/cvs/stats', authMiddleware, getCVStats);
router.get('/cvs/:id', authMiddleware, getCVById);
router.get('/cvs/:id/download', authMiddleware, downloadCV);
router.post('/cvs', authMiddleware, createCV);
router.put('/cvs/:id', authMiddleware, updateCV);
router.patch('/cvs/:id/set-default', authMiddleware, setDefaultCV);
router.delete('/cvs/:id', authMiddleware, deleteCV);

export default router;
