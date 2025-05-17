import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
        {
            from: { type: String, enum: ['mentor', 'learner'], required: true },
            text: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message; 