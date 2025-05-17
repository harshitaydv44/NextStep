import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const connectWithRetry = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('Attempting to connect to MongoDB Atlas...');
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Initial connection
connectWithRetry();

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
});

// Routes with error handling
app.use('/users', userRoutes);
app.use('/mentors', mentorRoutes);
app.use('/roadmaps', roadmapRoutes);

// Mentor Dashboard Routes
import mentorDashboardRoutes from './routes/mentorDashboardRoutes.js';
app.use('/mentor', mentorDashboardRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({
        message: "Backend is running",
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dbHost: mongoose.connection.host || 'not connected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.log('Port is busy, retrying with different port...');
        setTimeout(() => {
            server.close();
            server.listen(PORT + 1);
        }, 1000);
    }
});