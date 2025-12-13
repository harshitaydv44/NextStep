import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    const navigation = {
        main: [
            { name: 'Home', to: '/' },
            { name: 'About', to: '/about' },
            { name: 'Roadmaps', to: '/roadmaps' },
            { name: 'Mentors', to: '/mentors' },
            { name: 'Register', to: '/register' },
            { name: 'Login', to: '/login' },
        ],
        resources: [
            { name: 'Documentation', to: '#' },
            { name: 'Blog', to: '#' },
            { name: 'FAQs', to: '#' },
            { name: 'Support', to: '#' },
        ],
        legal: [
            { name: 'Privacy Policy', to: '#' },
            { name: 'Terms of Service', to: '#' },
            { name: 'Cookie Policy', to: '#' },
        ],
        social: [
            {
                name: 'GitHub',
                href: '#',
                icon: Github,
            },
            {
                name: 'LinkedIn',
                href: '#',
                icon: Linkedin,
            },
            {
                name: 'Twitter',
                href: '#',
                icon: Twitter,
            },
        ],
    };

    return (
        <footer className="bg-white border-t">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                            Next Step
                        </Link>
                        <p className="text-gray-600 max-w-xs">
                            Empowering B.Tech students to navigate their tech career journey with confidence.
                        </p>
                        <div className="flex space-x-6">
                            {navigation.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-500 hover:text-gray-600"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
                                <ul className="mt-6 space-y-4">
                                    {navigation.main.map((item) => (
                                        <li key={item.name}>
                                            <Link to={item.to} className="text-sm text-gray-600 hover:text-primary-600">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
                                <ul className="mt-6 space-y-4">
                                    {navigation.resources.map((item) => (
                                        <li key={item.name}>
                                            <Link to={item.to} className="text-sm text-gray-600 hover:text-primary-600">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                            <ul className="mt-6 space-y-4">
                                {navigation.legal.map((item) => (
                                    <li key={item.name}>
                                        <Link to={item.to} className="text-sm text-gray-600 hover:text-primary-600">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Next Step. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;