import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from '../server/routes/jobRoutes.js';

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Cached MongoDB Connection for Serverless Execution
let cachedDb: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not configured in Vercel environment variables.');
    return null;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = db;
    return db;
  } catch (err: any) {
    console.error('❌ MongoDB Atlas connection error in serverless:', err.message);
    return null;
  }
}

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    environment: 'vercel-serverless',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/jobs', jobRoutes);

export default app;
