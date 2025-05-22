import express from 'express';
import { addMentor, getMentors, bookMentorshipSession, sendMessageToMentor} from '../controllers/mentorController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', addMentor);
router.get('/all', getMentors);
router.post('/:mentorId/book', protect, bookMentorshipSession);
router.post('/:mentorsId/message',protect, sendMessageToMentor);

export default router;