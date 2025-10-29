import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/jwt-helper";

const TokenExtractor = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    // Extract token from current URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    console.log("TokenExtractor - Current URL:", window.location.href);
    console.log("TokenExtractor - Token found:", token);

    if (token) {
      try {
        // Save the token
        saveToken(token);
        setStatus("✅ Token saved successfully! Redirecting...");

        // Redirect to account page
        setTimeout(() => {
          navigate("/account");
        }, 2000);
      } catch (error) {
        console.error("Error saving token:", error);
        setStatus("❌ Error saving token. Please try again.");
      }
    } else {
      setStatus("❌ No token found in URL. Please try signing in again.");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Processing Sign-In
        </h2>
        <div className="text-center">
          <div className="mb-4">
            {status.includes("Processing") && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            )}
          </div>
          <p className="text-gray-700">{status}</p>

          {status.includes("No token") && (
            <div className="mt-6">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenExtractor;
