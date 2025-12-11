// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Roadmaps from "./pages/Roadmaps";
import RoadmapDetail from "./pages/RoadmapDetail";
import Mentors from "./pages/Mentors";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import MentorDashboard from "./pages/MentorDashboard";
import PrivateRoute from "./components/PrivateRoute";
import LearnerDashboard from "./pages/LearnerDashboard";

// Custom hook to handle mentor redirect
const useMentorRedirect = () => {
  const location = useLocation();
  
  useEffect(() => {
    // This effect will run on every route change
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // If user is a mentor and on the home page, redirect to mentor dashboard
    if (user?.role === 'teacher' && location.pathname === '/') {
      // Using setTimeout to ensure this runs after React Router has finished its navigation
      const timer = setTimeout(() => {
        window.location.href = '/mentor-dashboard';
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
};

// Wrapper component to handle the redirect logic
const HomeWithRedirect = () => {
  useMentorRedirect();
  return <Home />;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomeWithRedirect />} />
            <Route path="/about" element={<About />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/register" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />

            {/* Protected Mentor Routes */}
            <Route element={<PrivateRoute allowedRoles={['teacher']} />}>
              <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            </Route>

            {/* Protected Student Routes */}
            <Route element={<PrivateRoute allowedRoles={['student']} />}>
              <Route path="/my-dashboard" element={<LearnerDashboard />} />
            </Route>
            
            {/* Redirect any unmatched routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;