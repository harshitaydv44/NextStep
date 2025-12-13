// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
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
// PrivateRoute is no longer needed as we're using RequireAuth
import LearnerDashboard from "./pages/LearnerDashboard";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";

// Component to handle authentication and redirection
const RequireAuth = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  // If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectTo = user.role === 'teacher' ? '/mentor-dashboard' : '/my-dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Wrapper component to handle the redirect logic
const HomeWithRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (token && user && !isRedirecting) {
      setIsRedirecting(true);
      if (user.role === 'teacher') {
        navigate('/mentor-dashboard', { replace: true });
      } else if (user.role === 'student') {
        navigate('/my-dashboard', { replace: true });
      }
    } else if (!token && location.pathname === '/') {
      // If no token and on home page, just render Home
      return;
    } else if (!token) {
      // If no token and not on home page, redirect to login
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [location, navigate, isRedirecting]);

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <Home />;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />

            {/* Protected Home Route */}
            <Route path="/home-protected-placeholder" element={<HomeWithRedirect />} />

            {/* Protected Mentor Routes */}
            <Route
              path="/mentor-dashboard"
              element={
                <RequireAuth allowedRoles={['teacher']}>
                  <MentorDashboard />
                </RequireAuth>
              }
            />

            {/* Protected Student Routes */}
            <Route
              path="/my-dashboard"
              element={
                <RequireAuth allowedRoles={['student']}>
                  <LearnerDashboard />
                </RequireAuth>
              }
            />

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