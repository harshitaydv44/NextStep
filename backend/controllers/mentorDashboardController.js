import Message from '../models/Message.js';
import SessionBooking from '../models/SessionBooking.js';
import User from '../models/user.js'; // Assuming you need user info for population

// @desc    Get messages for a mentor
// @route   GET /api/mentor/messages
// @access  Private (Mentor)
export const getMentorMessages = async (req, res) => {
    try {
        // In a real app, req.user would come from auth middleware
        const mentorId = req.user._id;

        const messages = await Message.find({ mentorId }).populate('learnerId', 'fullName');

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching mentor messages:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send a reply to a message conversation
// @route   POST /api/mentor/messages/:conversationId/reply
// @access  Private (Mentor)
export const replyToMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;
        const mentorId = req.user._id;

        const message = await Message.findOne({ _id: conversationId, mentorId });

        if (!message) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        message.messages.push({ from: 'mentor', text });
        await message.save();

        res.status(200).json(message);
    } catch (error) {
        console.error('Error sending message reply:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get session bookings for a mentor
// @route   GET /api/mentor/sessions
// @access  Private (Mentor)
export const getMentorSessions = async (req, res) => {
    try {
        const mentorId = req.user._id;

        const sessions = await SessionBooking.find({ mentorId }).populate('learnerId', 'fullName');

        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching mentor sessions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add meeting link to a session booking
// @route   PUT /api/mentor/sessions/:sessionId/link
// @access  Private (Mentor)
export const addSessionLink = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { link } = req.body;
        const mentorId = req.user._id;

        const session = await SessionBooking.findOne({ _id: sessionId, mentorId });

        if (!session) {
            return res.status(404).json({ message: 'Session booking not found' });
        }

        session.link = link;
        await session.save();

        res.status(200).json(session);
    } catch (error) {
        console.error('Error adding session link:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark a session booking as completed
// @route   PUT /api/mentor/sessions/:sessionId/complete
// @access  Private (Mentor)
export const markSessionCompleted = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const mentorId = req.user._id;

        const session = await SessionBooking.findOne({ _id: sessionId, mentorId });

        if (!session) {
            return res.status(404).json({ message: 'Session booking not found' });
        }

        session.completed = true;
        await session.save();

        res.status(200).json(session);
    } catch (error) {
        console.error('Error marking session completed:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 