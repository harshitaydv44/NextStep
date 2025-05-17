import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Join Next Step today and take the first step towards your dream tech career. Get access to expert-curated roadmaps and mentorship.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/roadmaps"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors duration-300"
                        >
                            View Roadmaps
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection; 