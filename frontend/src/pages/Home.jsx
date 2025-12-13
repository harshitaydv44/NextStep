import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Map, Star } from 'lucide-react';
import TestimonialsSection from "../components/TestimonialsSection";
import CTASection from "../components/CTASection";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary-600" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Curated Learning Paths",
      description: "Follow structured roadmaps designed by industry experts to master your desired tech stack."
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Connect with experienced mentors who guide you through your learning journey."
    },
    {
      icon: Map,
      title: "Career Roadmaps",
      description: "Clear pathways to help you navigate from student to professional in your chosen field."
    },
    {
      icon: Star,
      title: "Personalized Growth",
      description: "Track your progress and get personalized recommendations for your career development."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r text-primary-900 to-secondary-700">
              Shape Your Tech Career Path
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your personalized roadmap to success in the tech industry. Get guidance, mentorship, and structured learning paths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/roadmaps"
                className="inline-flex items-center justify-center px-8 py-4 text-lg bg-primary-500 font-semibold text-whiterounded-xl rounded-xl hover:bg-primary-600 transition-colors duration-300"
              >
                Explore Roadmaps
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/mentors"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 border-2 border-primary-600 rounded-xl hover:bg-blue-50 transition-colors duration-300"
              >
                Find a Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose Next Step?</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We provide everything you need to accelerate your tech career journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default Home;
