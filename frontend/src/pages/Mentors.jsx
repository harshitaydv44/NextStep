import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import MentorCard from '../components/MentorCard';
import { mentorAPI } from '../services/api';

const DOMAIN_OPTIONS = [
  { id: 'all', name: 'All Domains' },
  { id: 'Web Development', name: 'Web Development' },
  { id: 'Mobile Development', name: 'Mobile Development' },
  { id: 'Data Science', name: 'Data Science' },
  { id: 'Cybersecurity', name: 'Cybersecurity' },
  { id: 'AI / Machine Learning', name: 'AI / Machine Learning' },
  { id: 'Cloud Computing', name: 'Cloud Computing' },
];

const mentors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Frontend Developer',
    company: 'Google',
    avatar: '/images/mentors/sarah.jpg',
    rating: 4.9,
    sessions: 156,
    skills: ['React', 'Vue', 'TypeScript'],
    domain: 'web',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Mobile App Developer',
    company: 'Apple',
    avatar: '/images/mentors/michael.jpg',
    rating: 4.8,
    sessions: 98,
    skills: ['iOS', 'Swift', 'React Native'],
    domain: 'mobile',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Data Scientist',
    company: 'Microsoft',
    avatar: '/images/mentors/emily.jpg',
    rating: 4.9,
    sessions: 124,
    skills: ['Python', 'Machine Learning', 'SQL'],
    domain: 'data',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Security Engineer',
    company: 'Amazon',
    avatar: '/images/mentors/david.jpg',
    rating: 4.7,
    sessions: 87,
    skills: ['Cybersecurity', 'Network Security', 'Ethical Hacking'],
    domain: 'security',
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Full Stack Developer',
    company: 'Netflix',
    avatar: '/images/mentors/lisa.jpg',
    rating: 4.9,
    sessions: 203,
    skills: ['Node.js', 'React', 'MongoDB'],
    domain: 'web',
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Android Developer',
    company: 'Meta',
    avatar: '/images/mentors/james.jpg',
    rating: 4.8,
    sessions: 145,
    skills: ['Android', 'Kotlin', 'Java'],
    domain: 'mobile',
  },
];

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    topic: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('all');
  const [sortBy, setSortBy] = useState('experience'); // 'experience' or 'name'

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await mentorAPI.getAllMentors();
      console.log('Mentors response:', response.data); // Debug log

      if (!response.data || response.data.length === 0) {
        setError('No mentors found. Please check back later.');
      } else {
        setMentors(response.data);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMentor) return;

    try {
      await mentorAPI.bookMentor(selectedMentor._id, bookingData);
      alert('Booking successful!');
      setSelectedMentor(null);
      setBookingData({ date: '', time: '', topic: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const filteredMentors = mentors
    .filter(mentor =>
      (activeDomain === 'all' || mentor.domain === activeDomain) &&
      (searchQuery === '' ||
        mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'experience') {
        return b.experience - a.experience;
      } else {
        return a.fullName.localeCompare(b.fullName);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-purple-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Mentor
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Connect with industry experts who can guide your career journey
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
          />
        </div>

        {/* Domain Filters */}
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar mb-8">
          {DOMAIN_OPTIONS.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setActiveDomain(domain.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${activeDomain === domain.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {domain.name}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Available Mentors ({filteredMentors.length})
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          >
            <option value="experience">Sort by Experience</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor._id} mentor={mentor} />
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No mentors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              Book a Session with {selectedMentor.fullName}
            </h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={bookingData.time}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, time: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Topic</label>
                <textarea
                  className="form-input"
                  value={bookingData.topic}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, topic: e.target.value })
                  }
                  required
                  rows="3"
                  placeholder="What would you like to discuss?"
                ></textarea>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors;
