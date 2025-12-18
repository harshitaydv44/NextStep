
import Message from '../models/Message.js';
import SessionBooking from '../models/SessionBooking.js';
import Mentor from '../models/mentor.js'; 
import User from '../models/user.js';


const getMentorIdFromUserId = async (userId) => {
 
  let mentor = await Mentor.findOne({ userId });

 
  if (!mentor) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

   
    if (user.role === 'teacher') {
      mentor = await Mentor.create({
        userId: user._id,
        name: user.fullName,
        role: user.expertise || 'Mentor',
        company: user.company || 'Freelance',
        avatar: user.avatar || '/images/mentors/default.jpg',
        bio: user.whyMentor || 'Experienced mentor ready to help students grow.',
        skills: user.expertise ? [user.expertise] : [],
        linkedin: user.linkedin || '',
        github: user.github || '',
        hourlyRate: 30, 
        domain: user.domain || 'Other', 
        experience: user.experience || 2, 
        rating: 0, 
        availability: 'Available', 
        education: [], 
        languages: ['English'] 
      });
    } else {
      throw new Error('User is not registered as a mentor');
    }
  }

  return mentor._id;
};


export const getMentorMessages = async (req, res) => {
  try {
    
    const mentorId = await getMentorIdFromUserId(req.user._id);

   
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


export const replyToMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

   
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message text is required and cannot be empty'
      });
    }

   
    const mentorId = await getMentorIdFromUserId(req.user._id);

   
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

   
    const newMessage = {
      from: 'mentor',
      text: text.trim(),
      timestamp: new Date()
    };

    message.messages.push(newMessage);
    await message.save();

  
    const populatedMessage = await Message.findById(message._id)
      .populate('learnerId', 'fullName email')
      .populate('mentorId', 'name');

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        ...populatedMessage.toObject(),
        newMessage 
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


export const getMentorSessions = async (req, res) => {
  try {
  
    const mentorId = await getMentorIdFromUserId(req.user._id);

   
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


export const addSessionLink = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { link } = req.body;

   
    const mentorId = await getMentorIdFromUserId(req.user._id);

   
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


export const markSessionCompleted = async (req, res) => {
  try {
    const { sessionId } = req.params;

   
    const mentorId = await getMentorIdFromUserId(req.user._id);

   
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