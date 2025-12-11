// controllers/mentorDashboardController.js
import Message from '../models/Message.js';
import SessionBooking from '../models/SessionBooking.js';
import Mentor from '../models/mentor.js'; // <-- IMPORT MENTOR MODEL
import User from '../models/user.js'; 

/**
 * Helper function to get Mentor ID from User ID
 * The auth middleware gives us req.user._id (User ID), but our
 * sessions and messages are linked to the Mentor ID.
 */
const getMentorIdFromUserId = async (userId) => {
  const mentor = await Mentor.findOne({ userId: userId });
  if (!mentor) throw new Error('Mentor profile not found for this user.');
  return mentor._id;
};

// @desc    Get messages for a mentor
// @route   GET /api/mentor/messages
// @access  Private (Mentor)
export const getMentorMessages = async (req, res) => {
  try {
    // 1. Get the Mentor ID from the logged-in User ID
    const mentorId = await getMentorIdFromUserId(req.user._id);

    // 2. Find messages using the correct Mentor ID
    const messages = await Message.find({ mentorId }).populate(
      'learnerId',
      'fullName'
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching mentor messages:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Send a reply to a message conversation
// @route   POST /api/mentor/messages/:conversationId/reply
// @access  Private (Mentor)
export const replyToMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    // Input validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Message text is required and cannot be empty' 
      });
    }

    // 1. Get the Mentor ID from the logged-in User ID
    const mentorId = await getMentorIdFromUserId(req.user._id);

    // 2. Find the message by its ID and verify the mentor owns it
    const message = await Message.findOne({
      _id: conversationId,
      mentorId: mentorId,
    });

    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Conversation not found or you do not have permission to reply to this conversation' 
      });
    }

    // Add the new message to the conversation
    const newMessage = {
      from: 'mentor',
      text: text.trim(),
      timestamp: new Date()
    };
    
    message.messages.push(newMessage);
    await message.save();

    // Populate the response with user details
    const populatedMessage = await Message.findById(message._id)
      .populate('learnerId', 'fullName email')
      .populate('mentorId', 'name');

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        ...populatedMessage.toObject(),
        newMessage // Include the newly added message in the response
      }
    });
  } catch (error) {
    console.error('Error sending message reply:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send reply',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get session bookings for a mentor
// @route   GET /api/mentor/sessions
// @access  Private (Mentor)
export const getMentorSessions = async (req, res) => {
  try {
    // 1. Get the Mentor ID from the logged-in User ID
    const mentorId = await getMentorIdFromUserId(req.user._id);

    // 2. Find sessions using the correct Mentor ID
    const sessions = await SessionBooking.find({ mentorId }).populate(
      'learnerId',
      'fullName'
    );

    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching mentor sessions:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Add meeting link to a session booking
// @route   PUT /api/mentor/sessions/:sessionId/link
// @access  Private (Mentor)
export const addSessionLink = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { link } = req.body;

    // 1. Get the Mentor ID from the logged-in User ID
    const mentorId = await getMentorIdFromUserId(req.user._id);

    // 2. Find the session by its ID *and* verify the mentor owns it
    const session = await SessionBooking.findOne({
      _id: sessionId,
      mentorId: mentorId,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session booking not found' });
    }

    session.link = link;
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    console.error('Error adding session link:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Mark a session booking as completed
// @route   PUT /api/mentor/sessions/:sessionId/complete
// @access  Private (Mentor)
export const markSessionCompleted = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // 1. Get the Mentor ID from the logged-in User ID
    const mentorId = await getMentorIdFromUserId(req.user._id);

    // 2. Find the session by its ID *and* verify the mentor owns it
    const session = await SessionBooking.findOne({
      _id: sessionId,
      mentorId: mentorId,
    });

    if (!session) {
      return res.status(404).json({ message: 'Session booking not found' });
    }

    session.completed = true;
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    console.error('Error marking session completed:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};