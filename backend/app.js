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

// MongoDB Connection
const connectWithRetry = async () => {
    const MONGODB_URI = 'mongodb://localhost:27017/nextstep';
    console.log('Attempting to connect to MongoDB...');
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
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
app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/roadmaps', roadmapRoutes);

// Mentor Dashboard Routes
import mentorDashboardRoutes from './routes/mentorDashboardRoutes.js';
app.use('/api/mentor', mentorDashboardRoutes);

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
let currentPort = PORT;
const MAX_PORT_RETRIES = 5;
let portRetries = 0;

const startServer = () => {
    const server = app.listen(currentPort, () => {
        console.log(`Server is running on port ${currentPort}`);
        portRetries = 0; // Reset retries on successful start
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE' && portRetries < MAX_PORT_RETRIES) {
            console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}...`);
            currentPort++;
            portRetries++;
            server.close();
            startServer();
        } else {
            console.error('Server error:', error);
            process.exit(1);
        }
    });
};

startServer();