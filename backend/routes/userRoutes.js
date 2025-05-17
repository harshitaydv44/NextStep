import express from 'express';
import { registerUser, loginUser, updateUserProfile, getCurrentUser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

// Protected route to update user profile
router.put('/profile', protect, updateUserProfile);

// Protected route to get current user profile
router.get('/me', protect, getCurrentUser);

export default router;