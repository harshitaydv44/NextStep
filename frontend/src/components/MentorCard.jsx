import React, { useState } from 'react';
import { Calendar, MessageCircle, Star } from 'lucide-react';
import BookSessionModal from './BookSessionModal';
import MessageModal from './MessageModal';

const MentorCard = ({ mentor }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const handleBookSession = () => {
    console.log('Opening booking modal for mentor:', mentor); // Debug log
    setIsBookingModalOpen(true);
  };

  const handleMessage = () => {
    setIsMessageModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-start space-x-4">
          <img
            src={mentor.avatar}
            alt={mentor.fullName}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.fullName)}&background=6366f1&color=fff`;
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{mentor.fullName}</h3>
            <p className="text-gray-600">{mentor.expertise}</p>
            <p className="text-purple-600 hover:text-purple-700 font-medium">
              {mentor.domain}
            </p>
          </div>
        </div>

        <div className="flex items-center mt-4 text-gray-600">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium">{mentor.experience} years</span>
          </div>
          <span className="mx-2">—</span>
          <span>{mentor.domain}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {mentor.expertise && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {mentor.expertise}
            </span>
          )}
          {mentor.linkedin && (
            <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              LinkedIn
            </a>
          )}
          {mentor.github && (
            <a href={mentor.github} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              GitHub
            </a>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBookSession}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Session
          </button>
          <button
            onClick={handleMessage}
            className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </button>
        </div>
      </div>

      <BookSessionModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        mentor={{
          ...mentor,
          _id: mentor._id // Ensure we have the correct ID
        }}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        mentor={mentor}
      />
    </>
  );
};

export default MentorCard;

