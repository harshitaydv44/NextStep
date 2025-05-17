import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roadmapAPI } from '../services/api';

const Roadmaps = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const response = await roadmapAPI.getAllRoadmaps();
            setRoadmaps(response.data);
        } catch (err) {
            setError('Failed to load roadmaps. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filteredRoadmaps = roadmaps
        .filter(roadmap =>
            (selectedCategory === 'all' || roadmap.category === selectedCategory) &&
            (roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-center">Learning Roadmaps</h1>
                <p className="text-gray-600 text-center max-w-2xl mx-auto">
                    Choose from our curated collection of learning roadmaps to guide your journey
                    in becoming a professional in your desired field.
                </p>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search roadmaps..."
                        className="form-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="form-input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="machine-learning">Machine Learning</option>
                    <option value="cloud-computing">Cloud Computing</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRoadmaps.map((roadmap) => (
                    <Link
                        key={roadmap._id}
                        to={`/roadmaps/${roadmap._id}`}
                        className="card hover:transform hover:-translate-y-1 transition-all duration-200"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {roadmap.category}
                                </span>
                                <span className="text-gray-600 text-sm">
                                    {roadmap.duration} months
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{roadmap.title}</h3>
                            <p className="text-gray-600 mb-4">{roadmap.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500">
                                        {roadmap.totalSteps} steps
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="text-sm text-gray-500">
                                        {roadmap.difficulty}
                                    </span>
                                </div>
                                <div className="text-blue-600">Learn more →</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredRoadmaps.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600">
                        No roadmaps found matching your criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Roadmaps;