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
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://nextstep-frontend-zspa.onrender.com'
        ],
        credentials: true
    })
);
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextstep';
// const PORT = process.env.PORT || 5000;
// let currentPort = PORT;
// const MAX_PORT_RETRIES = 5;
// let portRetries = 0;


const connectWithRetry = async () => {
    console.log('Attempting to connect to MongoDB...');
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();


mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
});


app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/mentor', mentorDashboardRoutes);


app.get('/', (req, res) => {
    res.json({
        message: 'Backend is running',
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dbHost: mongoose.connection.host || 'not connected',
    });
});


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});


const startServer = () => {
    const server = app.listen(currentPort, () => {
        console.log(`Server is running on port ${currentPort}`);
        portRetries = 0;
    });
});
    const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
