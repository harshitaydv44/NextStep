import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.register(formData);

      if (response?.data) {
        setStep("otp");
        setOtp("");
      } else {
        throw new Error("Invalid server response");
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

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authAPI.verifyOtp({
        email: formData.email,
        otp: otp.trim(),
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const redirectPath =
        user.role === "teacher"
          ? "/mentor-dashboard"
          : "/my-dashboard";

      navigate(redirectPath);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  // ⚠️ TEMPORARY FIX (until backend adds /resend-otp)
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await authAPI.register({
        email: formData.email,
        resend: true,
      });

      alert("OTP resent successfully!");
      setOtp("");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-light">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">

        <h2 className="text-3xl font-bold text-center mb-2">
          {step === "register" ? "Create your account" : "Verify Email"}
        </h2>

        {step === "otp" && (
          <p className="text-center text-sm text-gray-600 mb-4">
            We sent a 6-digit code to <strong>{formData.email}</strong>
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              minLength="8"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 rounded"
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 mt-6">
            <input
              type="text"
              maxLength="6"
              value={otp}
              autoFocus
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              className="w-full text-center text-xl px-4 py-3 border rounded"
              placeholder="• • • • • •"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 rounded"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="text-primary-600"
              >
                Wrong email?
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="text-primary-600"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
