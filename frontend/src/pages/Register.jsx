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

 
  const [step, setStep] = useState('register');

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      
      const response = await authAPI.register(formData);

      console.log('Registration Response:', response);

      if (response && response.data) {
        console.log('Switching to OTP step');
        
        setStep('otp');
    
        setOtp('');
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error('Registration error:', err);
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
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      
      const response = await authAPI.verifyOtp({
        email: formData.email,
        otp: otp.trim()
      });

      if (response.data) {
       
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

      
        const userRole = response.data.role || 'student';
        const redirectPath = userRole === 'teacher' ? '/mentor-dashboard' : '/my-dashboard';

       
        alert("Email verified successfully!");
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(
        err.response?.data?.message ||
        "Invalid or expired OTP. Please try again or request a new one."
      );
   
      if (err.response?.status === 400) {
        setError("Invalid or expired OTP. Please check your email and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

 
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await authAPI.register(formData);
      alert("New OTP has been sent to your email!");
      setOtp(""); 
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-light">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">

       
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
            {step === 'register' ? "Create your account" : "Verify Email"}
          </h2>
          {step === 'otp' && (
            <p className="mt-2 text-center text-sm text-gray-600">
              We have sent a 6-digit code to <strong>{formData.email}</strong>
            </p>
          )}
        </div>

      
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

      
        {step === 'register' && (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="8"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        )}

       
        {step === 'otp' && (
          <div className="mt-8">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">Verify Your Email</h3>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a 6-digit verification code to <span className="font-medium">{formData.email}</span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Verification Code
                  </label>
                  <div className="mt-1">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      required
                      className="block w-full px-4 py-3 text-center text-xl font-semibold tracking-widest border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="• • • • • •"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => {
                       
                        const value = e.target.value.replace(/\D/g, '');
                        setOtp(value);
                      }}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep('register')}
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Wrong email?
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-primary-600 hover:text-primary-500 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  The OTP is valid for 10 minutes
                </p>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;