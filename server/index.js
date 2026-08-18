import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Database connection with fallback
let isDbConnected = false;

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined in .env. Running in offline/cache mode.');
    return;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');
  } catch (error) {
    isDbConnected = false;
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('ℹ️ The backend will continue running and provide graceful fallback.');
  }
}

connectDB();

// API Health Check & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Job Application Routes
app.use('/api/jobs', jobRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.send('🚀 CareerPulse MongoDB API Server is Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`📡 Backend Server listening on http://localhost:${PORT}`);
});
