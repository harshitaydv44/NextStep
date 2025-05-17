import mongoose from 'mongoose';

const sessionBookingSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domain: String,
    date: String, // You might want to use a Date type here for better querying
    link: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const SessionBooking = mongoose.models.SessionBooking || mongoose.model('SessionBooking', sessionBookingSchema);
export default SessionBooking; 