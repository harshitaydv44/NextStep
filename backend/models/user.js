import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student',
    },
    // OTP & Verification Fields (NEW)
    otp: { 
        type: String 
    },
    otpExpires: { 
        type: Date 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
   
    expertise: { type: String },
    experience: { type: Number },
    domain: { type: String },
    linkedin: { type: String },
    github: { type: String },
    whyMentor: { type: String },
    
    college: { type: String },
    gradYear: { type: Number },
    
    domainInterest: { type: [String], default: [] },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;