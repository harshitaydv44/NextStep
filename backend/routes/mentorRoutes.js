import express from 'express';
import { addMentor, getMentors, bookMentorshipSession } from '../controllers/mentorController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', addMentor);
router.get('/all', getMentors);
router.post('/:mentorId/book', protect, bookMentorshipSession);

export default router;