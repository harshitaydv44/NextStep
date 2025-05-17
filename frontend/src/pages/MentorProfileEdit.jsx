import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const MentorProfileEdit = () => {
    const [mentorData, setMentorData] = useState({
        fullName: '',
        email: '',
        expertise: '',
        experience: '',
        domain: '',
        linkedin: '',
        github: '',
        whyMentor: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchMentorData = async () => {
            try {
                setLoading(true);
                const response = await authAPI.getCurrentUser();
                // Set only the fields the form can edit
                const user = response.data;
                setMentorData({
                    fullName: user.fullName || '',
                    email: user.email || '',
                    expertise: user.expertise || '',
                    experience: user.experience || '',
                    domain: user.domain || '',
                    linkedin: user.linkedin || '',
                    github: user.github || '',
                    whyMentor: user.whyMentor || '',
                    password: '', // Password is not fetched
                });
            } catch (err) {
                setError('Failed to fetch profile data.');
                console.error('Error fetching profile:', err);
                if (err.response) {
                    console.error('Error response status:', err.response.status);
                    console.error('Error response data:', err.response.data);
                } else if (err.request) {
                    console.error('Error request:', err.request);
                } else {
                    console.error('Error message:', err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMentorData();
    }, []);

    const handleChange = (e) => {
        setMentorData({ ...mentorData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
        const payload = { ...mentorData };
        if (payload.password === '') {
            delete payload.password;
        }

        console.log("Submitting payload:", payload);

        if (!authAPI || typeof authAPI.updateUserProfile !== 'function') {
            throw new Error("authAPI.updateUserProfile is not defined");
        }

        const response = await authAPI.updateUserProfile(payload);
        console.log("Update success:", response.data);
        setSuccess(true);

    } catch (err) {
        // Better error logging
        if (err.response) {
            console.error("Server Error:", err.response.status, err.response.data);
            setError(err.response.data.message || 'Server responded with an error.');
        } else if (err.request) {
            console.error("Request Error: No response from server.", err.request);
            setError('No response from server. Please try again.');
        } else {
            console.error("Client Error:", err.message);
            setError(err.message || 'Something went wrong.');
        }
    } finally {
        setSubmitting(false);
    }
};

    if (loading) return <div className="p-6">Loading profile...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    Profile updated successfully!
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" name="fullName" id="fullName" value={mentorData.fullName} onChange={handleChange} required className="form-input mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" value={mentorData.email} onChange={handleChange} required className="form-input mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Area of Expertise</label>
                    <input type="text" name="expertise" id="expertise" value={mentorData.expertise} onChange={handleChange} className="form-input mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience (in years)</label>
                    <input type="number" name="experience" id="experience" value={mentorData.experience} onChange={handleChange} className="form-input mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domain</label>
                    {/* You might want to use a dropdown here with DOMAIN_OPTIONS */}
                    <input type="text" name="domain" id="domain" value={mentorData.domain} onChange={handleChange} className="form-input mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
                    <input type="url" name="linkedin" id="linkedin" value={mentorData.linkedin} onChange={handleChange} className="form-input mt-1 block w-full" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub Profile URL</label>
                    <input type="url" name="github" id="github" value={mentorData.github} onChange={handleChange} className="form-input mt-1 block w-full" placeholder="https://github.com/..." />
                </div>
                <div>
                    <label htmlFor="whyMentor" className="block text-sm font-medium text-gray-700">Why you want to mentor (Optional)</label>
                    <textarea name="whyMentor" id="whyMentor" value={mentorData.whyMentor} onChange={handleChange} rows="3" className="form-input mt-1 block w-full"></textarea>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
                    <input type="password" name="password" id="password" value={mentorData.password} onChange={handleChange} className="form-input mt-1 block w-full" placeholder="Leave blank to keep current password" />
                </div>
                <div>
                    {/* Consider adding a confirm password field if updating password */}
                </div>
                <button type="submit" disabled={submitting} className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {submitting ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default MentorProfileEdit; 