import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: '/images/mentors/default.jpg'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    sessions: {
        type: Number,
        default: 0
    },
    skills: [{
        type: String
    }],
    domain: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    bio: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Mentor = mongoose.model('Mentor', mentorSchema);

export default Mentor;