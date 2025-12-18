import express from 'express';
import {
    registerUser,
    loginUser,
    updateUserProfile,
    getCurrentUser,
    getLearnerSessions,
    getLearnerMessages,
    replyToLearnerMessage,
    verifyOtp
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);


router.put('/update-profile', protect, updateUserProfile);
router.get('/me', protect, getCurrentUser);
router.get('/my-sessions', protect, getLearnerSessions);
router.get('/my-messages', protect, getLearnerMessages);
router.post('/my-messages/:conversationId/reply', protect, replyToLearnerMessage);

export default router;