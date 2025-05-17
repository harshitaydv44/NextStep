import React, { useState, useEffect } from "react";
import { mentorDashboardAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import MentorProfileEdit from './MentorProfileEdit';

// Function to get mentor data from localStorage
const getMentorData = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        // Assuming user object directly contains mentor fields if role is teacher
        if (user.role === 'teacher') {
            return {
                name: user.fullName,
                expertise: user.expertise || 'N/A',
                domain: user.domain || 'N/A',
                // Add other mentor fields as needed
            };
        }
    }
    return null;
};

function Sidebar({ selected, setSelected }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (
        <div className="w-56 bg-white border-r h-screen flex flex-col py-8 px-4 sticky top-0">
            <h2 className="text-2xl font-bold mb-8 text-purple-700">Mentor</h2>
            <nav className="flex flex-col gap-4 flex-grow">
                {[
                    { label: "Messages", value: "messages" },
                    { label: "Booked Sessions", value: "sessions" },
                    { label: "Edit Profile", value: "profile" },
                ].map((item) => (
                    <button
                        key={item.value}
                        className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${selected === item.value ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"}`}
                        onClick={() => setSelected(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <button
                className="text-left px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

function WelcomeSection({ mentor }) {
    if (!mentor) return null; // Don't render if mentor data is not available
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {mentor.name}</h1>
            <p className="text-gray-600">Expertise: <span className="font-medium text-purple-700">{mentor.expertise}</span></p>
            <p className="text-gray-600">Domain: <span className="font-medium text-purple-700">{mentor.domain}</span></p>
        </div>
    );
}

function MessagesSection() {
    const [messages, setMessages] = useState([]);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await mentorDashboardAPI.getMessages();
                setMessages(response.data);
                if (response.data.length > 0) {
                    setSelectedMsg(response.data[0]); // Select the first conversation by default
                }
            } catch (err) {
                setError("Failed to fetch messages.");
                console.error("Error fetching messages:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleSend = async () => {
        if (reply.trim() && selectedMsg) {
            try {
                // Optimistically update UI
                const newMessage = { from: "mentor", text: reply, timestamp: new Date().toISOString() };
                setSelectedMsg(prevState => ({
                    ...prevState,
                    messages: [...prevState.messages, newMessage]
                }));
                setReply("");

                // Send to backend
                await mentorDashboardAPI.replyToMessage(selectedMsg._id, reply);

                // Refresh messages after sending (optional, depending on desired real-time feel)
                // const response = await mentorDashboardAPI.getMessages();
                // setMessages(response.data);
                // setSelectedMsg(response.data.find(msg => msg._id === selectedMsg._id) || response.data[0]);

            } catch (err) {
                console.error("Error sending reply:", err);
                setError("Failed to send message."); // Consider more granular error handling
                // Revert optimistic update if sending fails? More complex.
            }
        }
    };

    if (loading) return <div className="p-6">Loading messages...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (messages.length === 0) return <div className="p-6">No messages yet.</div>;

    return (
        <div className="flex h-full border rounded-lg overflow-hidden bg-white">
            {/* Message List */}
            <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Messages</h2>
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`p-3 rounded-lg mb-2 cursor-pointer ${selectedMsg && selectedMsg._id === msg._id ? "bg-purple-100" : "hover:bg-gray-100"}`}
                        onClick={() => setSelectedMsg(msg)}
                    >
                        <div className="font-medium">{msg.learnerId?.fullName || 'Unknown Learner'}</div>
                        {/* Show preview of the last message */}
                        <div className="text-sm text-gray-600 truncate">{msg.messages[msg.messages.length - 1]?.text || 'Empty conversation'}</div>
                        {/* Display time of the last message */}
                        <div className="text-xs text-gray-400">{msg.messages[msg.messages.length - 1]?.timestamp ? new Date(msg.messages[msg.messages.length - 1].timestamp).toLocaleString() : 'No date'}</div>
                    </div>
                ))}
            </div>
            {/* Conversation */}
            <div className="flex-1 flex flex-col p-6">
                {selectedMsg ? (
                    <>
                        <div className="flex-1 overflow-y-auto mb-4">
                            <h3 className="font-semibold mb-2">Conversation with {selectedMsg.learnerId?.fullName || 'Unknown Learner'}</h3>
                            <div className="space-y-2">
                                {selectedMsg.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.from === "mentor" ? "justify-end" : "justify-start"}`}>
                                        <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === "mentor" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="form-input flex-1"
                                placeholder="Type your reply..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                disabled={loading} // Disable input while sending
                            />
                            <button
                                className={`px-4 py-2 rounded-lg font-semibold ${reply.trim() && !loading ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                onClick={handleSend}
                                disabled={!reply.trim() || loading}
                            >
                                {loading ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a message to view the conversation.
                    </div>
                )}
            </div>
        </div>
    );
}

function SessionsSection() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await mentorDashboardAPI.getSessions();
                setSessions(response.data);
            } catch (err) {
                setError("Failed to fetch sessions.");
                console.error("Error fetching sessions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleLinkChange = (id, value) => {
        // Optimistically update UI
        setSessions(sessions.map(s => s._id === id ? { ...s, link: value } : s));
    };

    const handleAddLink = async (id) => {
        const sessionToUpdate = sessions.find(s => s._id === id);
        if (sessionToUpdate && sessionToUpdate.link) {
            try {
                setLoading(true); // Optional: show loading indicator for this action
                await mentorDashboardAPI.addSessionLink(id, sessionToUpdate.link);
                // You might want to re-fetch or update state based on backend response
                // For simplicity, we assume optimistic update was sufficient or re-fetch here:
                const response = await mentorDashboardAPI.getSessions();
                setSessions(response.data);

            } catch (err) {
                console.error("Error adding link:", err);
                setError("Failed to add session link.");
                // Revert optimistic update if needed
            } finally {
                setLoading(false); // Optional: hide loading indicator
            }
        }
    };

    const handleMarkCompleted = async (id) => {
        try {
            // Optimistically update UI
            setSessions(sessions.map(s => s._id === id ? { ...s, completed: true } : s));

            setLoading(true); // Optional: show loading indicator
            // Send to backend
            await mentorDashboardAPI.markSessionCompleted(id);

            // You might want to re-fetch or update state based on backend response
            // const response = await mentorDashboardAPI.getSessions();
            // setSessions(response.data);

        } catch (err) {
            console.error("Error marking completed:", err);
            setError("Failed to mark session as completed.");
            // Revert optimistic update if needed
        } finally {
            setLoading(false); // Optional: hide loading indicator
        }
    };

    if (loading) return <div className="p-6">Loading sessions...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (sessions.length === 0) return <div className="p-6">No sessions booked yet.</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Booked Sessions</h2>
            <div className="space-y-4">
                {sessions.map(session => (
                    <div key={session._id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="font-medium">{session.learnerId?.fullName || 'Unknown Learner'}</div>
                            <div className="text-sm text-gray-600">Domain: {session.domain}</div>
                            <div className="text-sm text-gray-600">Date: {session.date}</div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Paste Zoom/Meet link"
                                value={session.link}
                                onChange={e => handleLinkChange(session._id, e.target.value)}
                                disabled={session.completed}
                            />
                            <button
                                className={`px-4 py-2 rounded-lg font-semibold ${session.link && !session.completed ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                onClick={() => handleAddLink(session._id)} // New handler for adding link
                                disabled={!session.link || session.completed}
                            >
                                Add Link
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg font-semibold ${!session.completed ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                onClick={() => handleMarkCompleted(session._id)}
                                disabled={session.completed}
                            >
                                {session.completed ? "Completed" : "Mark Completed"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const MentorDashboard = () => {
    const [selectedSection, setSelectedSection] = useState("messages");
    const mentorData = getMentorData();

    if (!mentorData) {
        // Redirect to login if mentor data is not found (should be caught by PrivateRoute, but good fallback)
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar Container */}
            <div className="w-full md:w-56 bg-white border-r md:h-screen flex flex-col py-8 px-4 sticky top-0">
                <Sidebar selected={selectedSection} setSelected={setSelectedSection} />
            </div>
            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto w-full">
                <WelcomeSection mentor={mentorData} />
                {selectedSection === "messages" && <MessagesSection />}
                {selectedSection === "sessions" && <SessionsSection />}
                {selectedSection === "profile" && (
                    <MentorProfileEdit />
                )}
                {selectedSection === "logout" && (
                    // Logout handled in Sidebar
                    null
                )}
            </main>
        </div>
    );
};

export default MentorDashboard; 