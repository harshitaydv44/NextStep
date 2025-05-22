import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;

    try {
        // Check if Authorization header exists and starts with 'Bearer'
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by decoded token ID
            req.user = await User.findById(decoded.id).select('-password');

            // Proceed to the next middleware/controller
            return next();
        }

        // If no token is found
        return res.status(401).json({ message: 'Not authorized, no token' });

    } catch (err) {
        // If token is invalid or error occurs
        return res.status(401).json({
            message: 'Not authorized, token failed',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
};

export default protect;
