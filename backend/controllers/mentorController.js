import Mentor from '../models/mentor.js';
import User from '../models/user.js';
import SessionBooking from '../models/SessionBooking.js';

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
        // Get all mentors and populate user data
        const mentors = await Mentor.find()
            .populate('userId', 'fullName email expertise experience domain linkedin github whyMentor')
            .select('-password');

        console.log('Found mentors:', mentors); // Debug log

        // Transform the data to include both mentor and user information
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
        const learnerId = req.user._id; // From auth middleware

        console.log('Booking request:', { mentorId, date, time, topic, learnerId }); // Debug log

        // Find the mentor by _id
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            console.log('Mentor not found for ID:', mentorId); // Debug log
            return res.status(404).json({ message: 'Mentor not found' });
        }

        console.log('Found mentor:', mentor); // Debug log

        // Create the session booking
        const sessionBooking = new SessionBooking({
            mentorId: mentor._id,
            learnerId,
            domain: mentor.domain,
            date: `${date} ${time}`, // Combine date and time
            topic
        });

        await sessionBooking.save();
        console.log('Created session booking:', sessionBooking); // Debug log

        // Increment the mentor's session count
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

// ✅ New function to send a message to mentor
export const sendMessageToMentor = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { message } = req.body;
        const senderId = req.user._id; // From auth middleware

        console.log('Sending message to mentor:', { mentorId, message, senderId });

        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // For now, we simulate sending a message
        res.status(200).json({
            message: 'Message sent successfully',
            data: {
                mentorId,
                senderId,
                message
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};
