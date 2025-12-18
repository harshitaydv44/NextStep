// src/pages/LearnerDashboard.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import { learnerDashboardAPI } from "../services/api";

import {
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper function to get user from localStorage
const getLocalUser = () => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

const getBrownAvatar = (name, avatarUrl) => {
  if (!avatarUrl || avatarUrl.includes("ui-avatars.com")) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "Mentor"
    )}&background=8B4513&color=fff`;
  }
  return avatarUrl;
};

// Main Dashboard Component
const LearnerDashboard = () => {
  const [learner, setLearner] = useState(getLocalUser());
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const tabClass = ({ selected }) =>
    `flex items-center gap-2 w-full px-4 py-3 text-sm font-medium leading-5 rounded-lg
     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
     ${selected
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
              Welcome, {learner?.fullName || "Learner"}
            </h1>
            <p className="text-lg text-gray-600">
              View your booked sessions and messages.
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
            </Tab.List>

            {/* Tab Content Panels */}
            <Tab.Panels className="mt-6">
              <Tab.Panel className="rounded-xl bg-white p-6 shadow focus:outline-none">
                <MySessions />
              </Tab.Panel>
              <Tab.Panel className="rounded-xl bg-white p-6 shadow focus:outline-none">
                <MyMessages />
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

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await learnerDashboardAPI.getSessions();
        setSessions(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch sessions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

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
      <h2 className="text-xl font-semibold text-gray-900">My Booked Sessions</h2>
      {sessions.map((session) => (
        <div
          key={session._id}
          className={`p-4 rounded-lg border ${session.completed ? "bg-gray-50" : "bg-white"
            }`}
        >
          <div className="flex flex-col md:flex-row md:justify-between">
            {/* Mentor Info */}
            <div className="flex items-center gap-3">
              <img
                src={getBrownAvatar(
                  session.mentorId?.name,
                  session.mentorId?.avatar
                )}
                alt={session.mentorId?.name}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <p className="font-semibold text-lg text-secondary-700">
                  {session.mentorId?.name || "Mentor"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(session.date).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`mt-4 md:mt-0 p-2 rounded-lg h-fit ${session.completed
                ? "border-green-200 bg-green-50"
                : "border-yellow-200 bg-yellow-50"
                }`}
            >
              <p
                className={`text-sm font-medium ${session.completed ? "text-green-700" : "text-yellow-700"
                  }`}
              >
                {session.completed ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Pending
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* This is the part you wanted! */}
          <div className="mt-4 pt-4 border-t">
            {session.link ? (
              <div>
                <p className="text-sm font-medium text-gray-700">Meeting Link:</p>
                <a
                  href={session.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center gap-2 mt-2"
                >
                  Join Session
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Your mentor has not added the meeting link yet. Please check back later.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Child Component: My Messages ---
function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await learnerDashboardAPI.getMessages();
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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
      await learnerDashboardAPI.replyToMessage(selectedConvo._id, replyText);
      setReplyLoading(false);
      closeReplyModal();
      fetchMessages();
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
    return (
      <div className="text-red-600 text-center py-10">{error}</div>
    );
  if (messages.length === 0)
    return (
      <div className="text-gray-500 text-center py-10">
        You have no messages.
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">My Conversations</h2>
        {messages.map((convo) => (
          <div key={convo._id} className="p-4 rounded-lg border bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={getBrownAvatar(convo.mentorId?.name, convo.mentorId?.avatar)}
                  alt={convo.mentorId?.name}
                  className="w-10 h-10 rounded-full"
                />

                <p className="font-semibold text-secondary-700">
                  {convo.mentorId?.name || "Mentor"}
                </p>
              </div>

              <button
                onClick={() => openReplyModal(convo)}
                className="btn btn-secondary py-2 px-3 text-sm bg-secondary-600 hover:bg-secondary-700"
              >
                Reply
              </button>
            </div>

            <h3 className="font-medium text-gray-800">Subject: {convo.subject}</h3>

            {/* This shows all messages, including replies! */}
            <div className="mt-4 space-y-2 border-t pt-4">
              {convo.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === "learner" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === "learner"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    <p
                      className={`text-sm ${msg.from === "learner" ? "text-white" : "text-black"
                        }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* We can add a reply box here later */}
          </div>
        ))}
      </div>

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
                    Reply to {selectedConvo?.mentorId?.name}
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

                    {replyError && <p className="text-sm text-red-600">{replyError}</p>}

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

export default LearnerDashboard;