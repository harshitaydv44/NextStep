import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const DOMAIN_OPTIONS = [
    "Web Development",
    "AI / Machine Learning",
    "Data Science",
    "Cloud Computing",
    "Mobile Development",
    "Cybersecurity",
    "Other",
];

const CreateAccount = () => {
    const [role, setRole] = useState("mentor");
    const [mentorForm, setMentorForm] = useState({
        fullName: "",
        expertise: "",
        experience: "",
        domain: "",
        email: "",
        linkedin: "",
        github: "",
        password: "",
        confirmPassword: "",
        whyMentor: "",
    });
    const [learnerForm, setLearnerForm] = useState({
        fullName: "",
        college: "",
        gradYear: "",
        domain: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleMentorChange = (e) => {
        setMentorForm({ ...mentorForm, [e.target.name]: e.target.value });
    };
    const handleLearnerChange = (e) => {
        setLearnerForm({ ...learnerForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (role === "mentor") {
                if (mentorForm.password !== mentorForm.confirmPassword) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }
                const payload = {
                    ...mentorForm,
                    role: "teacher",
                };
                await authAPI.register(payload);
                alert("Mentor account created! Please login.");
                navigate("/login");
            } else {
                const payload = {
                    ...learnerForm,
                    role: "student",
                };
                await authAPI.register(payload);
                alert("Learner account created! Please login.");
                navigate("/login");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-light py-12 px-4">

            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-primary-800">Create Account</h2>
                <div className="flex justify-center mb-8">
                    <button
                        className={`px-6 py-2 rounded-l-lg font-semibold border border-primary-600 focus:outline-none ${role === "mentor" ? "bg-primary-600 text-white" : "bg-white text-primary-600"}`}
                        onClick={() => setRole("mentor")}
                    >
                        Mentor
                    </button>
                    <button
                        className={`px-6 py-2 rounded-r-lg font-semibold border border-primary-600 focus:outline-none ${role === "learner" ? "bg-primary-600 text-white" : "bg-white text-primary-600"}`}
                        onClick={() => setRole("learner")}
                    >
                        Learner
                    </button>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {role === "mentor" ? (
                        <>
                            <input name="fullName" type="text" required placeholder="Full Name" className="form-input w-full" value={mentorForm.fullName} onChange={handleMentorChange} />
                            <input name="expertise" type="text" required placeholder="Area of Expertise (e.g., Web Dev, AI)" className="form-input w-full" value={mentorForm.expertise} onChange={handleMentorChange} />
                            <input name="experience" type="number" min="0" required placeholder="Experience (in years)" className="form-input w-full" value={mentorForm.experience} onChange={handleMentorChange} />
                            <select name="domain" required className="form-input w-full" value={mentorForm.domain} onChange={handleMentorChange}>
                                <option value="">Select Domain</option>
                                {DOMAIN_OPTIONS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <input name="email" type="email" required placeholder="Email" className="form-input w-full" value={mentorForm.email} onChange={handleMentorChange} />
                            <input name="linkedin" type="url" placeholder="LinkedIn Profile" className="form-input w-full" value={mentorForm.linkedin} onChange={handleMentorChange} />
                            <input name="github" type="url" placeholder="GitHub Profile" className="form-input w-full" value={mentorForm.github} onChange={handleMentorChange} />
                            <input name="password" type="password" required placeholder="Password" className="form-input w-full" value={mentorForm.password} onChange={handleMentorChange} />
                            <input name="confirmPassword" type="password" required placeholder="Confirm Password" className="form-input w-full" value={mentorForm.confirmPassword} onChange={handleMentorChange} />
                            <textarea name="whyMentor" placeholder="Why do you want to mentor? (optional)" className="form-input w-full" value={mentorForm.whyMentor} onChange={handleMentorChange} />
                        </>
                    ) : (
                        <>
                            <input name="fullName" type="text" required placeholder="Full Name" className="form-input w-full" value={learnerForm.fullName} onChange={handleLearnerChange} />
                            <input name="college" type="text" required placeholder="College Name" className="form-input w-full" value={learnerForm.college} onChange={handleLearnerChange} />
                            <input name="gradYear" type="number" min="2020" max="2100" required placeholder="Graduation Year" className="form-input w-full" value={learnerForm.gradYear} onChange={handleLearnerChange} />
                            <select name="domain" required className="form-input w-full" value={learnerForm.domain} onChange={handleLearnerChange}>
                                <option value="">Select Domain</option>
                                {DOMAIN_OPTIONS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <input name="email" type="email" required placeholder="Email" className="form-input w-full" value={learnerForm.email} onChange={handleLearnerChange} />
                            <input name="password" type="password" required placeholder="Password" className="form-input w-full" value={learnerForm.password} onChange={handleLearnerChange} />
                        </>
                    )}
                    <button type="submit" disabled={loading} className={`w-full py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}>{loading ? "Creating account..." : "Create Account"}</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;