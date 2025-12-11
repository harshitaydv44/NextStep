import mongoose from 'mongoose';

const sessionBookingSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true }, // ✅ Updated
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domain: String,
    date: String, 
    link: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const SessionBooking = mongoose.models.SessionBooking || mongoose.model('SessionBooking', sessionBookingSchema);
export default SessionBooking;
