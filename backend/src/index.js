import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import jobRoutes from './routes/jobs.js';
import paymentRoutes from './routes/payments.js';
import aiRoutes from './routes/ai.js';
import matchRoutes from './routes/match.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rizeos-portal';

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected to:', MONGO_URI);
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Please make sure MongoDB is running or set MONGO_URI environment variable');
  process.exit(1);
});

app.get('/', (req, res) => res.json({ status: 'ok', service: 'rizeos-backend' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'rizeos-backend', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/match', matchRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
