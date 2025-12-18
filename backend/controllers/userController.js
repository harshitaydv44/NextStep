import User from '../models/user.js';
import SessionBooking from '../models/SessionBooking.js';
import Message from '../models/Message.js';
import Mentor from '../models/mentor.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import sendEmail from '../utils/sendEmail.js';


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


export const registerUser = async (req, res) => {
    const { fullName, email, password, role, ...otherData } = req.body;

    try {
       
        const userExists = await User.findOne({ email });

        if (userExists) {
         
            if (!userExists.isVerified) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

                userExists.otp = otp;
                userExists.otpExpires = otpExpires;
                await userExists.save();

                const message = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #8B4513;">NextStep - Verify your email</h2>
            <p>Hi ${userExists.fullName},</p>
            <p>Please use the OTP below to verify your email address:</p>
            <h1 style="color: #333; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 10 minutes.</p>
          </div>
        </div>
      `;

                try {
                    await sendEmail({
                        email: userExists.email,
                        subject: 'NextStep - Verify your email',
                        message,
                    });

                    return res.status(200).json({
                        message: 'OTP resent to your email. Please verify to login.',
                        email: userExists.email,
                    });
                } catch (error) {
                    return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
                }
            }

    
            return res.status(400).json({ message: 'User already exists' });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

       
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires,
            ...otherData 
        });

        if (user) {
          
            if (role === 'teacher') {
                await Mentor.create({
                    userId: user._id,
                    name: fullName,
                    role: otherData.expertise || 'Mentor',
                    company: otherData.company || 'Freelance',
                    avatar: otherData.avatar || '/images/mentors/default.jpg',
                    bio: otherData.whyMentor || '',
                    skills: otherData.expertise ? [otherData.expertise] : [],
                    linkedin: otherData.linkedin || '',
                    github: otherData.github || ''
                });
            }

            
            const message = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #8B4513;">Welcome to NextStep!</h2>
            <p>Hi ${user.fullName},</p>
            <p>Thank you for signing up. Please use the OTP below to verify your email address:</p>
            <h1 style="color: #333; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 10 minutes.</p>
          </div>
        </div>
      `;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'NextStep - Verify your email',
                    message,
                });

                res.status(201).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    message: 'OTP sent to your email. Please verify to login.',
                });
            } catch (error) {
              
                await User.findByIdAndDelete(user._id);
                res.status(500).json({ message: 'Email could not be sent. Please try again.' });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

     
        if (user.otp === otp && user.otpExpires > Date.now()) {

           
            user.isVerified = true;
            user.otp = undefined;       
            user.otpExpires = undefined; 
            await user.save();

          
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                isVerified: true
            });

        } else {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

      
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

       
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

      
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;

        
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        
        if (user.role === 'teacher') {
            user.expertise = req.body.expertise || user.expertise;
            user.experience = req.body.experience || user.experience;
            user.domain = req.body.domain || user.domain;
            user.linkedin = req.body.linkedin || user.linkedin;
            user.github = req.body.github || user.github;
            user.whyMentor = req.body.whyMentor || user.whyMentor;
        } else if (user.role === 'student') {
            user.college = req.body.college || user.college;
            user.gradYear = req.body.gradYear || user.gradYear;
        }

    
        if (req.body.domainInterest) {
            user.domainInterest = req.body.domainInterest;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            ...(updatedUser.role === 'teacher' && {
                expertise: updatedUser.expertise,
                experience: updatedUser.experience,
                domain: updatedUser.domain,
                linkedin: updatedUser.linkedin,
                github: updatedUser.github,
                whyMentor: updatedUser.whyMentor,
            }),
            ...(updatedUser.role === 'student' && {
                college: updatedUser.college,
                gradYear: updatedUser.gradYear,
            }),
            domainInterest: updatedUser.domainInterest,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const getLearnerSessions = async (req, res) => {
    try {
        const sessions = await SessionBooking.find({
            learnerId: req.user._id
        })
            .select('-__v -createdAt -updatedAt')
            .populate({
                path: 'mentorId',
                select: 'name avatar',
            })
            .sort({ date: -1 })
            .lean();

        const formattedSessions = sessions.map(session => ({
            ...session,
            link: session.link || null,
        }));

        res.status(200).json(formattedSessions);
    } catch (error) {
        console.error('Error fetching learner sessions:', error);
        res.status(500).json({
            message: 'Error fetching your sessions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getLearnerMessages = async (req, res) => {
    try {
        const messages = await Message.find({ learnerId: req.user._id })
            .populate({
                path: 'mentorId',
                model: 'Mentor',
                select: 'name avatar',
            })
            .sort({ updatedAt: -1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching learner messages:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const replyToLearnerMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message text is required and cannot be empty'
            });
        }

        const message = await Message.findOne({
            _id: conversationId,
            learnerId: req.user._id,
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found or you do not have permission to reply to this conversation'
            });
        }

        const newMessage = {
            from: 'learner',
            text: text.trim(),
            timestamp: new Date()
        };

        message.messages.push(newMessage);
        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate({
                path: 'mentorId',
                model: 'Mentor',
                select: 'name avatar',
            })
            .populate('learnerId', 'fullName email');

        res.status(200).json({
            success: true,
            message: 'Reply sent successfully',
            data: {
                ...populatedMessage.toObject(),
                newMessage
            }
        });
    } catch (error) {
        console.error('Error sending learner message reply:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send reply',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};