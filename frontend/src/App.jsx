import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
