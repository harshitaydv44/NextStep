import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react';

export default function MyMessages() {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');

    // This would normally come from an API
    useEffect(() => {
        // Simulate API call
        const fetchMessages = async () => {
            try {
                // Replace with actual API call
                // const response = await api.get('/api/messages');
                // setMessages(response.data);

                // Sample data
                const sampleMessages = [
                    {
                        id: 1,
                        from: 'Mentor Name',
                        subject: 'Welcome to Your Learning Journey!',
                        content: 'Hello! I\'m excited to be your mentor. Let me know how I can assist you with your learning goals.',
                        date: '2023-06-10T10:30:00',
                        read: true
                    },
                    // Add more sample messages as needed
                ];

                setMessages(sampleMessages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Here you would typically send the message to your API
        console.log('Sending message:', newMessage);

        // For demo purposes, we'll just clear the input
        setNewMessage('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow overflow-hidden">
            {/* Message List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {messages.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {messages.map((message) => (
                                <li
                                    key={message.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => setSelectedMessage(message)}
                                >
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center ${!message.read ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                            <MessageSquare className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {message.from}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {message.subject}
                                            </p>
                                        </div>
                                        <div className="ml-2 text-xs text-gray-500">
                                            {new Date(message.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Mail className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium">No messages</h3>
                            <p className="mt-1 text-sm">Your messages will appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 flex flex-col">
                {selectedMessage ? (
                    <>
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {selectedMessage.subject}
                                    </h2>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <span>From: {selectedMessage.from}</span>
                                        <span className="mx-1">•</span>
                                        <span>{new Date(selectedMessage.date).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="prose max-w-none">
                                <p>{selectedMessage.content}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium">Select a message</h3>
                            <p className="mt-1 text-sm">Choose a message to read or reply to it.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
