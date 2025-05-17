import User from '../models/user.js';
import Mentor from '../models/mentor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register user
export const registerUser = async (req, res) => {
    try {
        console.log('Registration request body:', req.body); // Debug log
        const {
            fullName,
            email,
            password,
            role, // 'teacher' for mentor, 'student' for learner
            expertise,
            experience,
            domain,
            linkedin,
            github,
            whyMentor,
            college,
            gradYear,
            domainInterest
        } = req.body;

        // Validation
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({
                message: 'Please provide all required fields',
                received: { fullName, email, password: password ? 'provided' : 'missing', role }
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare user data
        const userData = {
            fullName,
            email,
            password: hashedPassword,
            role,
            domainInterest: domainInterest || [],
        };

        // Add mentor fields if role is teacher
        if (role === 'teacher') {
            userData.expertise = expertise;
            userData.experience = experience;
            userData.domain = domain;
            userData.linkedin = linkedin;
            userData.github = github;
            userData.whyMentor = whyMentor;
        }
        // Add learner fields if role is student
        if (role === 'student') {
            userData.college = college;
            userData.gradYear = gradYear;
            userData.domain = domain;
        }

        // Create user
        const user = await User.create(userData);

        // If user is a teacher, create a mentor record
        if (role === 'teacher') {
            const mentorData = {
                userId: user._id,
                name: fullName,
                role: expertise,
                company: 'Independent', // Default value
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff`,
                domain: domain,
                hourlyRate: 0, // Default value
                bio: whyMentor || 'No bio provided',
                skills: [expertise], // Add expertise as a skill
                rating: 0,
                sessions: 0
            };

            try {
                const mentor = await Mentor.create(mentorData);
                console.log('Created mentor record:', mentor); // Debug log
            } catch (mentorError) {
                console.error('Error creating mentor record:', mentorError);
                // If mentor creation fails, delete the user and return error
                await User.findByIdAndDelete(user._id);
                return res.status(500).json({
                    message: 'Failed to create mentor profile',
                    error: mentorError.message
                });
            }
        }

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            // Include mentor-specific fields if the user is a mentor
            ...(user.role === 'teacher' && {
                expertise: user.expertise,
                experience: user.experience,
                domain: user.domain,
                linkedin: user.linkedin,
                github: user.github,
                whyMentor: user.whyMentor,
            }),
            // Include learner-specific fields if the user is a learner (optional)
            ...(user.role === 'student' && {
                college: user.college,
                gradYear: user.gradYear,
                // domain is already included above if populated on user object
            })
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email; // Consider validation if email changes

            // Update mentor-specific fields if user is a teacher
            if (user.role === 'teacher') {
                user.expertise = req.body.expertise || user.expertise;
                user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
                user.domain = req.body.domain || user.domain;
                user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
                user.github = req.body.github !== undefined ? req.body.github : user.github;
                user.whyMentor = req.body.whyMentor !== undefined ? req.body.whyMentor : user.whyMentor;
            }

            // Update learner-specific fields if user is a student (optional for mentor dashboard focus)
            if (user.role === 'student') {
                user.college = req.body.college || user.college;
                user.gradYear = req.body.gradYear !== undefined ? req.body.gradYear : user.gradYear;
                // domain is already handled above
            }

            // Update domain interests (if applicable, e.g., from a multi-select)
            if (req.body.domainInterest !== undefined) {
                user.domainInterest = req.body.domainInterest;
            }

            // Update password if provided
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                expertise: updatedUser.expertise,
                experience: updatedUser.experience,
                domain: updatedUser.domain,
                linkedin: updatedUser.linkedin,
                github: updatedUser.github,
                whyMentor: updatedUser.whyMentor,
                college: updatedUser.college,
                gradYear: updatedUser.gradYear,
                domainInterest: updatedUser.domainInterest,
            });

        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};


