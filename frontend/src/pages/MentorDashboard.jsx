// src/pages/MentorDashboard.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import { authAPI, mentorDashboardAPI } from "../services/api";
import {
  User,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Github,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper function to get user from localStorage
const getLocalUser = () => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

// Main Dashboard Component
const MentorDashboard = () => {
  const [mentor, setMentor] = useState(getLocalUser());
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const tabClass = ({ selected }) =>
    `flex items-center gap-2 w-full px-4 py-3 text-sm font-medium leading-5 rounded-lg
     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
     ${
       selected
         ? "bg-primary-600 text-white shadow"
         : "text-gray-700 hover:bg-gray-100 hover:text-primary-700"
     }`;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {mentor?.fullName || "Mentor"}
            </h1>
            <p className="text-lg text-gray-600">
              Manage your sessions, messages, and profile.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="w-full">
          <Tab.Group>
            <Tab.List className="flex flex-col md:flex-row md:space-x-1 rounded-xl bg-white p-2 shadow">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button className={tabClass({ selected })}>
                    <Calendar className="w-5 h-5" />
                    My Sessions
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button className={tabClass({ selected })}>
                    <MessageSquare className="w-5 h-5" />
                    My Messages
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button className={tabClass({ selected })}>
                    <User className="w-5 h-5" />
                    Edit Profile
                  </button>
                )}
              </Tab>
            </Tab.List>

            {/* Tab Content Panels */}
            <Tab.Panels className="mt-6">
              <Tab.Panel className="rounded-xl bg-white p-6 shadow focus:outline-none">
                <MySessions />
              </Tab.Panel>
              <Tab.Panel className="rounded-xl bg-white p-6 shadow focus:outline-none">
                <MyMessages />
              </Tab.Panel>
              <Tab.Panel className="rounded-xl bg-white p-6 shadow focus:outline-none">
                <EditProfile mentorData={mentor} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

// --- Child Component: My Sessions ---
function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkInput, setLinkInput] = useState({});

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await mentorDashboardAPI.getSessions();
      setSessions(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sessions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChange = (id, value) => {
    setLinkInput({ ...linkInput, [id]: value });
  };

  const handleAddLink = async (sessionId) => {
    try {
      const link = linkInput[sessionId];
      if (!link) return;
      await mentorDashboardAPI.addSessionLink(sessionId, link);
      fetchSessions(); // Refresh list
    } catch (err) {
      console.error("Failed to add link:", err);
      alert("Failed to add link. Please try again.");
    }
  };

  const handleMarkCompleted = async (sessionId) => {
    try {
      await mentorDashboardAPI.markSessionCompleted(sessionId);
      fetchSessions(); // Refresh list
    } catch (err) {
      console.error("Failed to mark completed:", err);
      alert("Failed to mark session. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center py-10">{error}</div>
    );
  if (sessions.length === 0)
    return (
      <div className="text-gray-500 text-center py-10">
        You have no booked sessions.
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Booked Sessions</h2>
      {sessions.map((session) => (
        <div
          key={session._id}
          className={`p-4 rounded-lg border ${
            session.completed ? "bg-gray-50" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <p className="font-semibold text-lg text-secondary-700">
                {session.learnerId?.fullName || "Unknown Learner"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Topic:</strong> {session.topic || "Not specified"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong>{" "}
                {new Date(session.date).toLocaleDateString()}
              </p>
            </div>
            <div
              className={`mt-4 md:mt-0 p-2 rounded-lg ${
                session.completed
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  session.completed ? "text-green-700" : "text-yellow-700"
                }`}
              >
                Status: {session.completed ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            {session.completed ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Session completed.</span>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor={`link-${session._id}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Add Meeting Link
                  </label>
                  <input
                    type="text"
                    id={`link-${session._id}`}
                    className="form-input w-full mt-1"
                    placeholder="https://zoom.us/..."
                    value={linkInput[session._id] || session.link || ""}
                    onChange={(e) =>
                      handleLinkChange(session._id, e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-2 self-end">
                  <button
                    onClick={() => handleAddLink(session._id)}
                    className="btn btn-secondary py-2 px-3 text-sm bg-secondary-600 hover:bg-secondary-700"
                  >
                    Save Link
                  </button>
                  <button
                    onClick={() => handleMarkCompleted(session._id)}
                    className="btn btn-primary py-2 px-3 text-sm"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Child Component: My Messages ---
// --- Child Component: My Messages (WITH REPLY) ---
function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the reply modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await mentorDashboardAPI.getMessages();
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const openReplyModal = (convo) => {
    setSelectedConvo(convo);
    setIsModalOpen(true);
    setReplyText("");
    setReplyError(null);
  };

  const closeReplyModal = () => {
    setIsModalOpen(false);
    setSelectedConvo(null);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConvo) return;
    
    setReplyLoading(true);
    setReplyError(null);
    
    try {
      await mentorDashboardAPI.replyToMessage(selectedConvo._id, replyText);
      setReplyLoading(false);
      closeReplyModal();
      fetchMessages(); // Refresh the message list
    } catch (err) {
      setReplyLoading(false);
      setReplyError("Failed to send reply. Please try again.");
      console.error("Reply error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  if (error)
    return <div className="text-red-600 text-center py-10">{error}</div>;
  if (messages.length === 0)
    return (
      <div className="text-gray-500 text-center py-10">
        You have no messages.
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
        {messages.map((convo) => (
          <div key={convo._id} className="p-4 rounded-lg border bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-secondary-700">
                  {convo.learnerId?.fullName || "Unknown Learner"}
                </p>
                <h3 className="font-medium text-gray-800">Subject: {convo.subject}</h3>
              </div>
              <button
                onClick={() => openReplyModal(convo)}
                className="btn btn-secondary py-2 px-3 text-sm bg-secondary-600 hover:bg-secondary-700"
              >
                Reply
              </button>
            </div>
            
            <div className="mt-4 space-y-2 border-t pt-4">
              {convo.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "mentor" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.from === "mentor"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Reply Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeReplyModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Reply to {selectedConvo?.learnerId?.fullName}
                  </Dialog.Title>
                  <form onSubmit={handleReplySubmit} className="mt-4 space-y-4">
                    <textarea
                      rows="4"
                      className="form-input w-full"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                    />
                    {replyError && (
                      <p className="text-sm text-red-600">{replyError}</p>
                    )}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex-1"
                        onClick={closeReplyModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-1"
                        disabled={replyLoading}
                      >
                        {replyLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Send Reply"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
// --- Child Component: Edit Profile (FIXED) ---
function EditProfile({ mentorData }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    expertise: "",
    experience: 0,
    domain: "",
    linkedin: "",
    github: "",
    whyMentor: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const DOMAIN_OPTIONS = [
    "Web Development",
    "AI / Machine Learning",
    "Data Science",
    "Cloud Computing",
    "Mobile Development",
    "Cybersecurity",
    "Other",
  ];

  useEffect(() => {
    // Fetch the LATEST profile data from the server
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // This is the correct, working API call
        const response = await authAPI.getCurrentUser();
        const user = response.data.user || response.data;
        // Pre-fill form with server data
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          expertise: user.expertise || "",
          experience: user.experience || 0,
          domain: user.domain || "",
          linkedin: user.linkedin || "",
          github: user.github || "",
          whyMentor: user.whyMentor || "",
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Could not load your profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // This is the correct, working API call
      const response = await authAPI.updateUserProfile(formData);
      
      // CRITICAL: Update localStorage
      const updatedUser = response.data.user || response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setSuccess("Profile updated successfully!");
    } catch (err){
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="form-input"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Expertise */}
        <div>
          <label htmlFor="expertise" className="form-label">
            Area of Expertise
          </label>
          <input
            type="text"
            name="expertise"
            id="expertise"
            className="form-input"
            placeholder="e.g., React & Node.js"
            value={formData.expertise}
            onChange={handleChange}
            required
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="form-label">
            Experience (in years)
          </label>
          <input
            type="number"
            name="experience"
            id="experience"
            className="form-input"
            value={formData.experience}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        {/* Domain */}
        <div className="md:col-span-2">
          <label htmlFor="domain" className="form-label">
            Primary Domain
          </label>
          <select
            name="domain"
            id="domain"
            className="form-input"
            value={formData.domain}
            onChange={handleChange}
            required
          >
            <option value="">Select your main domain</option>
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* LinkedIn */}
        <div>
          <label htmlFor="linkedin" className="form-label inline-flex items-center gap-1">
            <Linkedin className="w-4 h-4" /> LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedin"
            id="linkedin"
            className="form-input"
            placeholder="https://linkedin.com/in/..."
            value={formData.linkedin}
            onChange={handleChange}
          />
        </div>

        {/* GitHub */}
        <div>
          <label htmlFor="github" className="form-label inline-flex items-center gap-1">
            <Github className="w-4 h-4" /> GitHub Profile
          </label>
          <input
            type="url"
            name="github"
            id="github"
            className="form-input"
            placeholder="https://github.com/..."
            value={formData.github}
            onChange={handleChange}
          />
        </div>

        {/* Why Mentor */}
        <div className="md:col-span-2">
          <label htmlFor="whyMentor" className="form-label">
            Why do you want to mentor?
          </label>
          <textarea
            name="whyMentor"
            id="whyMentor"
            rows="4"
            className="form-input"
            placeholder="Share your motivation..."
            value={formData.whyMentor}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t text-right">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary inline-flex items-center gap-2 w-full md:w-auto"
        >
          {saving && <Loader2 className="w-5 h-5 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default MentorDashboard;