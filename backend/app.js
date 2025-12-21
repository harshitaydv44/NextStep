import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import mentorDashboardRoutes from './routes/mentorDashboardRoutes.js';

dotenv.config();

const app = express();


app.use(
  cors({
    origin: 'https://nextstep-frontend-zspa.onrender.com',
    credentials: true,
  })
);


app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI;

const connectWithRetry = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});


app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/mentor', mentorDashboardRoutes);


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'NextStep Backend is running',
    mongoStatus:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});


app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
