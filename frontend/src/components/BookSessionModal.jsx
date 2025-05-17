import React, { useState } from 'react';
import Modal from './Modal';
import { mentorAPI } from '../services/api';

const BookSessionModal = ({ isOpen, onClose, mentor }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        topic: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const bookingData = {
                date: formData.date,
                time: formData.time,
                topic: formData.topic
            };

            // Debug logs
            console.log('Mentor object:', mentor);
            console.log('Mentor ID:', mentor?._id);
            console.log('Booking data:', bookingData);

            if (!mentor || !mentor._id) {
                throw new Error('Invalid mentor data: Missing mentor ID');
            }

            const response = await mentorAPI.bookMentor(mentor._id, bookingData);
            console.log('Booking response:', response);

            if (response.data) {
                onClose();
            } else {
                throw new Error('No response data received');
            }
        } catch (err) {
            console.error('Booking error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to book session');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Book a Mentorship Session">
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
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
                        <textarea
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="What would you like to discuss?"
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
                            {loading ? 'Booking...' : 'Book Session'}
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

export default BookSessionModal; 