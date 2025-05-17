import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, BookOpen, Code, Database, Laptop, Terminal, Github } from 'lucide-react';

const ResourceCard = ({ title, links }) => (
    <div className="mt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Recommended Resources:</h4>
        <ul className="space-y-2">
            {links.map((link, index) => (
                <li key={index}>
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                        <Globe className="w-4 h-4 mr-2" />
                        {link.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const TechnologyCard = ({ title, technologies, resources }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <ul className="space-y-3 mb-6">
            {technologies.map((tech, index) => (
                <li key={index} className="flex items-center text-gray-700">
                    <Code className="w-5 h-5 mr-3 text-blue-600" />
                    {tech}
                </li>
            ))}
        </ul>
        <ResourceCard links={resources} />
    </div>
);

const ProjectCard = ({ title, description, skills }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
                <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

const AdditionalResources = () => (
    <div className="bg-gray-50 border-t">
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Online Classes */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                        Online Classes
                    </h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                Udemy
                            </a>
                        </li>
                        <li>
                            <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                Coursera
                            </a>
                        </li>
                        <li>
                            <a href="https://www.pluralsight.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                Pluralsight
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Practice Platforms */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Laptop className="w-5 h-5 mr-2 text-blue-600" />
                        Practice Platforms
                    </h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://www.freecodecamp.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                freeCodeCamp
                            </a>
                        </li>
                        <li>
                            <a href="https://www.codecademy.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                Codecademy
                            </a>
                        </li>
                        <li>
                            <a href="https://www.frontendmentor.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                Frontend Mentor
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Developer Tools */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Terminal className="w-5 h-5 mr-2 text-blue-600" />
                        Developer Tools
                    </h3>
                    <ul className="space-y-3">
                        <li>
                            <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                VS Code
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="https://www.postman.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                Postman
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const RoadmapDetail = () => {
    const technologies = {
        frontend: {
            title: 'Frontend Fundamentals',
            technologies: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Responsive Design'],
            resources: [
                { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
                { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
            ],
        },
        frameworks: {
            title: 'Frontend Frameworks',
            technologies: ['React.js', 'Vue.js', 'Angular', 'State Management'],
            resources: [
                { title: 'React Documentation', url: 'https://reactjs.org' },
                { title: 'Vue.js Guide', url: 'https://vuejs.org' },
                { title: 'Angular Guide', url: 'https://angular.io' },
            ],
        },
        backend: {
            title: 'Backend Development',
            technologies: ['Node.js', 'Express.js', 'Python/Django', 'Java/Spring'],
            resources: [
                { title: 'Node.js Docs', url: 'https://nodejs.org' },
                { title: 'Express Guide', url: 'https://expressjs.com' },
                { title: 'Django Project', url: 'https://www.djangoproject.com' },
            ],
        },
        databases: {
            title: 'Databases',
            technologies: ['SQL', 'MongoDB', 'PostgreSQL', 'Redis'],
            resources: [
                { title: 'MongoDB University', url: 'https://university.mongodb.com' },
                { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com' },
                { title: 'Redis Documentation', url: 'https://redis.io' },
            ],
        },
    };

    const projects = [
        {
            title: 'Personal Portfolio',
            description: 'A responsive portfolio to showcase projects with modern design principles.',
            skills: ['React', 'Tailwind CSS', 'Responsive Design'],
        },
        {
            title: 'E-commerce Platform',
            description: 'A full-stack e-commerce site with payment integration and user authentication.',
            skills: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
        },
        {
            title: 'Social Media Dashboard',
            description: 'A dashboard with real-time updates and analytics using modern web technologies.',
            skills: ['Vue.js', 'Firebase', 'Charts.js', 'WebSocket'],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto max-w-6xl px-4 py-4">
                    <Link to="/roadmaps" className="inline-flex items-center text-gray-600 hover:text-blue-600">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Roadmaps
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Web Development Career Path
                    </h1>
                    <p className="text-xl text-blue-100">
                        Master the art of building modern web applications
                    </p>
                </div>
            </div>

            {/* Learning Path Section */}
            <div className="container mx-auto max-w-6xl px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Learning Path</h2>

                {/* Technology Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {Object.values(technologies).map((tech, index) => (
                        <TechnologyCard key={index} {...tech} />
                    ))}
                </div>

                {/* Projects Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-8">Project Ideas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} {...project} />
                    ))}
                </div>
            </div>

            {/* Additional Resources Section */}
            <AdditionalResources />
        </div>
    );
};

export default RoadmapDetail; 