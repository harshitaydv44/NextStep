import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;

    try {
       
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            
            token = req.headers.authorization.split(' ')[1];

          
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
            req.user = await User.findById(decoded.id).select('-password');

            
            return next();
        }

     
        return res.status(401).json({ message: 'Not authorized, no token' });

    } catch (err) {
     
        return res.status(401).json({
            message: 'Not authorized, token failed',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
};

export default protect;
