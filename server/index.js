console.log("Initializing server...");
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import jobApplicationRoutes from './routes/jobApplications.js';
import cvRoutes from './routes/cvs.js';
import todoRoutes from './routes/todos.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow credentials (cookies)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

console.log(process.env.CLIENT_URL);

// Body parser
app.use(express.json());
app.use(cookieParser());

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Authentication API is running',
        storage: process.env.MONGO_URI && process.env.MONGO_URI !== 'your_mongodb_cluster_uri'
            ? 'MongoDB'
            : 'JSON File'
    });
});

app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', jobApplicationRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api', todoRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database Connection
const connectDB = async () => {
    if (!process.env.MONGO_URI || process.env.MONGO_URI === 'your_mongodb_cluster_uri') {
        console.log('⚠️  MONGO_URI not configured, using JSON file storage');
        console.log('📁 Users will be stored in: server/data/users.json');
        console.log('📁 Tokens will be stored in: server/data/refreshTokens.json');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('⚠️  Falling back to JSON file storage');
    }
};

connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`🔐 Auth endpoints available at: http://localhost:${PORT}/api/auth`);
});
