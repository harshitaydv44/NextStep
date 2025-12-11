import express from 'express';
import { registerUser, loginUser, updateUserProfile, getCurrentUser,getLearnerSessions,getLearnerMessages } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

// Protected route to update user profile
router.put('/update-profile', protect, updateUserProfile);

// Protected route to get current user profile
router.get('/me', protect, getCurrentUser);
router.get('/my-sessions', protect, getLearnerSessions);
router.get('/my-messages', protect, getLearnerMessages);

export default router;