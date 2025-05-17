import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, role, content, rating }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center space-x-1 mb-4">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
        </div>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="border-t pt-4">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
    </div>
);

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Alex Johnson",
            role: "Software Engineer at Google",
            content: "Next Step helped me structure my learning path and connect with amazing mentors. The roadmaps were incredibly helpful in guiding my career transition.",
            rating: 5
        },
        {
            name: "Sarah Chen",
            role: "Full Stack Developer",
            content: "The mentorship program was a game-changer. My mentor provided invaluable insights and helped me land my dream job in tech.",
            rating: 5
        },
        {
            name: "Michael Rodriguez",
            role: "Recent B.Tech Graduate",
            content: "As a student, the structured roadmaps helped me focus on what's important. The community support is amazing!",
            rating: 5
        }
    ];

    return (
        <section className="py-20 px-6 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    What Our Users Say
                </h2>
                <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                    Join thousands of students who have transformed their careers with Next Step
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection; 