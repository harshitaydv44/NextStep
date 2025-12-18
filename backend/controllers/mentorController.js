import Mentor from '../models/mentor.js';
import User from '../models/user.js';
import SessionBooking from '../models/SessionBooking.js';
import Message from '../models/Message.js';

export const addMentor = async (req, res) => {
    try {
        const mentor = new Mentor(req.body);
        await mentor.save();
        res.status(201).json({ message: 'Mentor added' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding mentor', error: err.message });
    }
};

export const getMentors = async (req, res) => {
    try {
       
        const mentors = await Mentor.find()
            .populate('userId', 'fullName email expertise experience domain linkedin github whyMentor')
            .select('-password');

        console.log('Found mentors:', mentors); 

       
        const transformedMentors = mentors.map(mentor => ({
            ...mentor.toObject(),
            fullName: mentor.userId?.fullName || mentor.name,
            email: mentor.userId?.email,
            expertise: mentor.userId?.expertise || mentor.role,
            experience: mentor.userId?.experience,
            domain: mentor.userId?.domain || mentor.domain,
            linkedin: mentor.userId?.linkedin,
            github: mentor.userId?.github,
            whyMentor: mentor.userId?.whyMentor,
            avatar: mentor.avatar
        }));

        res.status(200).json(transformedMentors);
    } catch (err) {
        console.error('Error in getMentors:', err); // Debug log
        res.status(500).json({ message: 'Error fetching mentors', error: err.message });
    }
};

export const bookMentorshipSession = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { date, time, topic } = req.body;
        const learnerId = req.user._id; 

        console.log('Booking request:', { mentorId, date, time, topic, learnerId }); // Debug log

       
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            console.log('Mentor not found for ID:', mentorId); 
            return res.status(404).json({ message: 'Mentor not found' });
        }

        console.log('Found mentor:', mentor); 

       
        const sessionBooking = new SessionBooking({
            mentorId: mentor._id,
            learnerId,
            domain: mentor.domain,
            date: `${date} ${time}`, 
            topic
        });

        await sessionBooking.save();
        console.log('Created session booking:', sessionBooking); 

      
        mentor.sessions += 1;
        await mentor.save();

        res.status(201).json({
            message: 'Session booked successfully',
            session: sessionBooking
        });
    } catch (err) {
        console.error('Error booking session:', err);
        res.status(500).json({ message: 'Error booking session', error: err.message });
    }
};


export const sendMessageToMentor = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { subject, message } = req.body;
        const learnerId = req.user._id; 

     
        if (!subject || !message) {
            return res.status(400).json({ 
                message: 'Subject and message are required' 
            });
        }

        console.log('Sending message to mentor:', { mentorId, subject, message, learnerId });

      
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

      
        const newMessage = new Message({
            mentorId,
            learnerId,
            subject: subject.trim(),
            messages: [{
                from: 'learner',
                text: message.trim(),
                timestamp: new Date()
            }]
        });

        await newMessage.save();

      
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('learnerId', 'fullName email')
            .populate('mentorId', 'name');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: populatedMessage
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to send message',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

