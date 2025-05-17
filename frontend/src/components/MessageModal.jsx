import React, { useState } from 'react';
import Modal from './Modal';
import api from '../services/api';

const MessageModal = ({ isOpen, onClose, mentor }) => {
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateForm = () => {
        if (!formData.subject.trim()) {
            setError('Please enter a subject');
            return false;
        }
        if (!formData.message.trim()) {
            setError('Please enter a message');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const messageData = {
                subject: formData.subject.trim(),
                message: formData.message.trim()
            };

            await api.post(`/mentors/${mentor._id}/message`, messageData);
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send message';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send a Message">
            <div className="space-y-6">
                {/* Mentor Info */}
                <div className="flex items-center space-x-4">
                    <img
                        src={mentor?.avatar}
                        alt={mentor?.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor?.fullName)}&background=6366f1&color=fff`;
                        }}
                    />
                    <div>
                        <h4 className="font-medium text-gray-900">{mentor?.fullName}</h4>
                        <p className="text-sm text-gray-500">{mentor?.expertise} • {mentor?.domain}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            placeholder="What's your message about?"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Write your message here..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default MessageModal; 