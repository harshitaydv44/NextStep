import React from 'react';
import { Calendar, Clock, Video, Loader2 } from 'lucide-react';

export default function MySessions() {
    
    const upcomingSessions = [
        {
            id: 1,
            title: 'Introduction to Web Development',
            date: '2023-06-15T14:00:00',
            duration: '60 minutes',
            mentor: 'John Doe',
            meetingLink: 'https://meet.example.com/abc123'
        },
       
    ];

    const pastSessions = [
        
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h3>
                {upcomingSessions.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {upcomingSessions.map((session) => (
                                <li key={session.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-primary-600 truncate">
                                                {session.title}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Upcoming
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    {new Date(session.date).toLocaleDateString()}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                    {session.duration}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <span>Mentor: </span>
                                                <span className="ml-1 font-medium text-gray-900">{session.mentor}</span>
                                            </div>
                                        </div>
                                        {session.meetingLink && (
                                            <div className="mt-4">
                                                <a
                                                    href={session.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                >
                                                    <Video className="-ml-1 mr-2 h-5 w-5" />
                                                    Join Session
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
                        <p className="mt-1 text-sm text-gray-500">Your scheduled sessions will appear here.</p>
                    </div>
                )}
            </div>

            {pastSessions.length > 0 && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Past Sessions</h3>
                    
                </div>
            )}
        </div>
    );
}
