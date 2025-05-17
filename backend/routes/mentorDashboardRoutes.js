import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { getMentorMessages, replyToMessage, getMentorSessions, addSessionLink, markSessionCompleted } from '../controllers/mentorDashboardController.js';

const router = express.Router();

// Protect all mentor dashboard routes
router.use(protect);

// Messages
router.get('/messages', getMentorMessages);
router.post('/messages/:conversationId/reply', replyToMessage);

// Sessions
router.get('/sessions', getMentorSessions);
router.put('/sessions/:sessionId/link', addSessionLink); // Using PUT as it's an update
router.put('/sessions/:sessionId/complete', markSessionCompleted); // Using PUT as it's an update

export default router; 