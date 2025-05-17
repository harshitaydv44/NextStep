import mongoose from 'mongoose';
import Mentor from '../models/mentor.js';
import Roadmap from '../models/Roadmap.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB Atlas');

        // Clear existing data
        console.log('Clearing existing data...');
        await Mentor.deleteMany({});
        await Roadmap.deleteMany({});

        // Seed Mentors
        console.log('Seeding mentors...');
        const mentors = [
            {
                name: 'Sarah Johnson',
                role: 'Senior Frontend Developer',
                company: 'Google',
                avatar: '/images/mentors/sarah.jpg',
                rating: 4.9,
                sessions: 156,
                skills: ['React', 'Vue', 'TypeScript'],
                domain: 'web',
                hourlyRate: 150,
                bio: 'Experienced frontend developer with 8+ years in building scalable web applications.'
            },
            {
                name: 'Michael Chen',
                role: 'Mobile App Developer',
                company: 'Apple',
                avatar: '/images/mentors/michael.jpg',
                rating: 4.8,
                sessions: 98,
                skills: ['iOS', 'Swift', 'React Native'],
                domain: 'mobile',
                hourlyRate: 140,
                bio: 'iOS developer with expertise in building consumer mobile applications.'
            }
        ];

        await Mentor.insertMany(mentors);
        console.log('Mentors seeded successfully');

        // Seed Roadmaps
        console.log('Seeding roadmaps...');
        const roadmaps = [
            {
                title: 'Frontend Development Path',
                description: 'Complete guide to becoming a frontend developer',
                category: 'web-development',
                duration: 6,
                difficulty: 'Intermediate',
                totalSteps: 24,
                steps: [
                    { title: 'HTML & CSS Basics', duration: '2 weeks' },
                    { title: 'JavaScript Fundamentals', duration: '4 weeks' },
                    { title: 'React.js', duration: '6 weeks' }
                ]
            },
            {
                title: 'Mobile App Development',
                description: 'Learn to build iOS and Android apps',
                category: 'mobile-development',
                duration: 8,
                difficulty: 'Advanced',
                totalSteps: 32,
                steps: [
                    { title: 'Mobile UI/UX', duration: '2 weeks' },
                    { title: 'iOS Development', duration: '6 weeks' },
                    { title: 'Android Development', duration: '6 weeks' }
                ]
            }
        ];

        await Roadmap.insertMany(roadmaps);
        console.log('Roadmaps seeded successfully');

        console.log('All data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData(); 