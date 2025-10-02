import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/jwt-helper";

const OAuth2LoginCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOAuth2Callback = () => {
      try {
        // Extract token from URL parameters or URL hash
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );

        const token = params.get("token") || hashParams.get("access_token");
        const error = params.get("error") || hashParams.get("error");
        const errorDescription =
          params.get("error_description") ||
          hashParams.get("error_description");
        const state = params.get("state");

        console.log("OAuth2 callback received:", {
          url: window.location.href,
          token: token ? "present" : "missing",
          error,
          errorDescription,
          state,
          searchParams: window.location.search,
          hashParams: window.location.hash,
        });

        if (error) {
          console.error("OAuth2 authentication error:", {
            error,
            errorDescription,
          });

          let errorMessage = "Authentication failed";
          if (error === "access_denied") {
            errorMessage = "Access was denied. Please try again.";
          } else if (error === "invalid_request") {
            errorMessage =
              "Invalid request. Please check OAuth2 configuration.";
          } else if (errorDescription) {
            errorMessage = `Authentication failed: ${errorDescription}`;
          } else {
            errorMessage = `Authentication failed: ${error}`;
          }

          setError(errorMessage);
          setLoading(false);
          return;
        }

        if (token) {
          console.log("OAuth2 token received, saving and redirecting...");
          console.log("Token length:", token.length);
          console.log("Token preview:", token.substring(0, 50) + "...");

          saveToken(token);

          // Verify token was saved
          const savedToken = localStorage.getItem("auth_token");
          console.log(
            "Token saved to localStorage:",
            savedToken ? "Yes" : "No"
          );

          // Set success state immediately
          setLoading(false);

          // Redirect to account page after successful authentication
          console.log("Redirecting to /account...");
          setTimeout(() => {
            navigate("/account");
          }, 1000);
        } else {
          console.error("No token received from OAuth2 callback");
          setError("No authentication token received");
          setLoading(false);

          // Redirect to login page after a delay
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (err) {
        console.error("Error processing OAuth2 callback:", err);
        setError("Failed to process authentication");
        setLoading(false);
      }
    };

    handleOAuth2Callback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Completing Google Sign-In
          </h2>
          <p className="text-gray-600">
            Please wait while we authenticate your account...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Google Sign-In Failed</h3>
            <p className="text-sm">{error}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Try Again
            </button>

            <div className="text-xs text-gray-500">
              <p className="mb-2">
                If this error persists, it might be due to:
              </p>
              <ul className="text-left space-y-1">
                <li>• OAuth2 configuration issues</li>
                <li>• Incorrect redirect URI</li>
                <li>• Invalid client credentials</li>
                <li>• Domain restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-md mb-4">
          Authentication successful! Redirecting to your account...
        </div>
      </div>
    </div>
  );
};

export default OAuth2LoginCallback;
