import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Database, Cpu, Smartphone, Server, Cloud } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Full Stack Development',
    description: 'Master the MERN stack and build modern web applications from scratch.',
    icon: Code,
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    path: '/roadmaps/full-stack'
  },
  {
    id: 2,
    title: 'Data Science',
    description: 'Learn data analysis, machine learning, and data visualization with Python.',
    icon: Database,
    duration: '16 weeks',
    level: 'Intermediate',
    path: '/roadmaps/data-science'
  },
  {
    id: 3,
    title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps with React Native and Flutter.',
    icon: Smartphone,
    duration: '10 weeks',
    level: 'Beginner to Intermediate',
    path: '/roadmaps/mobile-dev'
  },
  {
    id: 4,
    title: 'DevOps Engineering',
    description: 'Master CI/CD, Docker, Kubernetes, and cloud infrastructure.',
    icon: Server,
    duration: '14 weeks',
    level: 'Intermediate to Advanced',
    path: '/roadmaps/devops'
  },
  {
    id: 5,
    title: 'Cloud Computing',
    description: 'Learn AWS, Azure, and GCP for scalable cloud solutions.',
    icon: Cloud,
    duration: '12 weeks',
    level: 'Intermediate',
    path: '/roadmaps/cloud'
  },
  {
    id: 6,
    title: 'Machine Learning Engineering',
    description: 'Advanced ML algorithms, model deployment, and MLOps practices.',
    icon: Cpu,
    duration: '16 weeks',
    level: 'Advanced',
    path: '/roadmaps/ml-engineering'
  }
];

const CourseCard = ({ course }) => {
  const Icon = course.icon;
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
            {course.duration}
          </span>
          <span className="px-3 py-1 bg-secondary-50 text-secondary-700 text-sm rounded-full">
            {course.level}
          </span>
        </div>
        <Link
          to={course.path}
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          View Roadmap
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const Courses = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Our Courses</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white text-opacity-90">
            Choose your learning path and get mentored by industry experts to achieve your career goals.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 px-6 border-t border-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our mentors can help you create a personalized learning path based on your goals and experience level.
          </p>
          <Link
            to="/mentors"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Find a Mentor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Courses;
