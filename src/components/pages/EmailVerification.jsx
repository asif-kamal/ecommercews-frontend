import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  verifyEmailAPI,
  resendVerificationCodeAPI,
} from "../../api/authentication";
import { saveToken, isAuthenticated } from "../../utils/jwt-helper";

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Get email from navigation state
  const email = location.state?.email || "";

  useEffect(() => {
    // If no email is provided, redirect to register
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerificationCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const verificationData = {
        username: email,
        code: verificationCode,
      };

      console.log("Sending verification data:", verificationData);

      // Call the backend API to verify the code
      const response = await verifyEmailAPI(verificationData);

      console.log("Verification response:", response);

      // If verification successful and we receive a JWT token
      if (response?.token) {
        // Save the JWT token to keep user logged in
        saveToken(response.token);
        console.log("JWT token saved, user is now logged in");

        // Verify that the token was saved correctly and user is authenticated
        if (isAuthenticated()) {
          console.log("Authentication confirmed - user is logged in");
          alert("Email verified successfully! Welcome!");
          navigate("/account");
        } else {
          console.error("Token saved but authentication failed");
          setError("Authentication failed. Please try logging in manually.");
        }
      } else if (response?.success || response?.message) {
        // Fallback: verification successful but no token provided
        alert(
          "Email verified successfully! Please login with your credentials."
        );
        navigate("/login");
      } else {
        // Unexpected response format
        setError(
          "Verification completed but received unexpected response. Please try logging in."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError("Invalid verification code. Please try again.");
      } else if (error.response?.status === 410) {
        setError("Verification code has expired. Please request a new one.");
      } else {
        setError("Verification failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setResendMessage("");
      setError("");

      await resendVerificationCodeAPI({ email });
      setResendMessage("Verification code sent to your email!");
    } catch (error) {
      console.error("Resend error:", error);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Verify Your Email
        </h2>

        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">
            We've sent a 6-digit verification code to:
          </p>
          <p className="font-semibold text-gray-800">{email}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              className="w-full px-3 py-3 text-center text-2xl border rounded focus:outline-none focus:border-blue-500 tracking-widest"
              placeholder="000000"
              maxLength="6"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            className={`w-full py-2 px-4 rounded mb-4 ${
              loading || verificationCode.length !== 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {resendMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {resendMessage}
          </div>
        )}

        {/* Resend Code */}
        <div className="text-center mb-4">
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            disabled={resendLoading}
            className={`text-blue-500 hover:text-blue-700 underline ${
              resendLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </button>
        </div>

        {/* Back to Register */}
        <div className="text-center">
          <button
            onClick={handleBackToRegister}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
