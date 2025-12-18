import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
      
        console.log('Form submitted:', formData);
        
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
      
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="min-h-screen bg-white">
          
            <section className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white text-opacity-90">
                        Have questions? We're here to help! Reach out to our team for any inquiries.
                    </p>
                </div>
            </section>

            
            <section className="py-16 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Send us a message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="How can we help you?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Your message here..."
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 md:py-4 md:text-lg transition-colors"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>

                       
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
                            <p className="text-gray-600 mb-8">
                                Have questions about our platform or need assistance? Our team is here to help you with any inquiries you may have.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 text-primary-600">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                                        <p className="text-gray-600">support@nextstep.com</p>
                                        <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 text-primary-600">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                        <p className="text-gray-500 text-sm mt-1">Mon-Fri, 9am-6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 text-primary-600">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Visit Us</h3>
                                        <p className="text-gray-600">123 Tech Park Avenue</p>
                                        <p className="text-gray-600">San Francisco, CA 94107</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    {[
                                        { name: 'Twitter', href: '#' },
                                        { name: 'LinkedIn', href: '#' },
                                        { name: 'GitHub', href: '#' },
                                        { name: 'Instagram', href: '#' },
                                    ].map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="text-gray-500 hover:text-gray-700"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="sr-only">{item.name}</span>
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                <span className="text-sm font-medium text-gray-700">{item.name[0]}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
