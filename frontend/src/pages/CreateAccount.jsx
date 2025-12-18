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
    const [step, setStep] = useState("register");
    const [otp, setOtp] = useState("");
    const [pendingEmail, setPendingEmail] = useState("");
    const [pendingPayload, setPendingPayload] = useState(null);
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
                setPendingEmail(mentorForm.email);
                setPendingPayload(payload);
                setOtp("");
                setStep("otp");
            } else {
                const payload = {
                    ...learnerForm,
                    role: "student",
                };

                await authAPI.register(payload);
                setPendingEmail(learnerForm.email);
                setPendingPayload(payload);
                setOtp("");
                setStep("otp");
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

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const cleanedOtp = (otp || "").trim();

        if (cleanedOtp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await authAPI.verifyOtp({
                email: pendingEmail,
                otp: cleanedOtp,
            });

            if (response?.data?.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data));

                const userRole = response.data.role || "student";
                const redirectPath = userRole === "teacher" ? "/mentor-dashboard" : "/my-dashboard";
                navigate(redirectPath);
                return;
            }

            setError("OTP verification failed. Please try again.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid or expired OTP. Please try again or request a new one."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!pendingPayload) {
            setError("Please submit the registration form first.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await authAPI.register(pendingPayload);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to resend OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-light py-12 px-4">

            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-primary-800">
                    {step === "register" ? "Create Account" : "Verify Email"}
                </h2>

                {step === "register" && (
                    <div className="flex justify-center mb-8">
                        <button
                            type="button"
                            className={`px-6 py-2 rounded-l-lg font-semibold border border-primary-600 focus:outline-none ${role === "mentor" ? "bg-primary-600 text-white" : "bg-white text-primary-600"}`}
                            onClick={() => setRole("mentor")}
                        >
                            Mentor
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-2 rounded-r-lg font-semibold border border-primary-600 focus:outline-none ${role === "learner" ? "bg-primary-600 text-white" : "bg-white text-primary-600"}`}
                            onClick={() => setRole("learner")}
                        >
                            Learner
                        </button>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {step === "register" && (
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
                        <button type="submit" disabled={loading} className={`w-full py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}>{loading ? "Sending OTP..." : "Create Account"}</button>
                    </form>
                )}

                {step === "otp" && (
                    <div>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            We sent a 6-digit OTP to <strong>{pendingEmail}</strong>
                        </p>

                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <input
                                name="otp"
                                type="text"
                                required
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                placeholder="Enter OTP"
                                className="form-input w-full text-center text-xl tracking-widest"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                maxLength={6}
                                autoFocus
                            />

                            <button type="submit" disabled={loading} className={`w-full py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}>{loading ? "Verifying..." : "Verify & Login"}</button>

                            <div className="flex items-center justify-between text-sm">
                                <button type="button" className="text-primary-600 hover:text-primary-500" onClick={() => { setStep("register"); setOtp(""); }}>
                                    Wrong email?
                                </button>
                                <button type="button" className="text-primary-600 hover:text-primary-500 disabled:opacity-50" onClick={handleResendOtp} disabled={loading}>
                                    Resend OTP
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 text-center">OTP is valid for 10 minutes</p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateAccount;