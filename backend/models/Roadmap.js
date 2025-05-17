import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    totalSteps: {
        type: Number,
        required: true
    },
    steps: [{
        title: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        resources: [{
            title: String,
            url: String,
            type: {
                type: String,
                enum: ['video', 'article', 'course', 'other']
            }
        }]
    }]
}, {
    timestamps: true
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;