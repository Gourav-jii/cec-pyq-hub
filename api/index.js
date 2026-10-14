import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../server/config/db.js';
import paperRoutes from '../server/routes/paperRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB Atlas (with serverless connection caching)
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Ensure DB is connected before processing API requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use('/api/papers', paperRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CEC PYQ Hub Vercel Serverless Backend is live',
    timestamp: new Date().toISOString(),
  });
});

export default app;
