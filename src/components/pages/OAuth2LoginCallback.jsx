import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/jwt-helper";

const OAuth2LoginCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("OAuth2LoginCallback component rendering...");
  console.log("Current URL on render:", window.location.href);

  useEffect(() => {
    const handleOAuth2Callback = () => {
      try {
        console.log("=== OAuth2LoginCallback Component Mounted ===");
        console.log("Current URL:", window.location.href);
        console.log("Current pathname:", window.location.pathname);
        console.log("URL Search params:", window.location.search);
        console.log("URL Hash:", window.location.hash);

        // Check if we're stuck in a redirect loop
        if (window.location.href.includes("accounts.google.com")) {
          console.error(
            "Still on Google accounts page - OAuth2 flow not completing!"
          );
          setError(
            "OAuth2 flow stuck on Google selection page. Check backend configuration."
          );
          setLoading(false);
          return;
        }

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
        const code = params.get("code"); // OAuth2 authorization code

        console.log("OAuth2 callback received:", {
          url: window.location.href,
          token: token ? "present" : "missing",
          error,
          errorDescription,
          state,
          code: code ? "present" : "missing",
          searchParams: window.location.search,
          hashParams: window.location.hash,
        });

        // Add explicit debugging for token extraction
        console.log("=== TOKEN EXTRACTION DEBUG ===");
        console.log("URL search params:", window.location.search);
        console.log("Parsed URL params:", Object.fromEntries(params.entries()));
        console.log("Token from params.get('token'):", params.get("token"));
        console.log("Token variable value:", token);
        console.log("Token truthy check:", !!token);

        // Check if this is a redirect from Google with authorization code
        if (code && !token && !error) {
          console.log(
            "Authorization code received, backend should process this and redirect with token"
          );
          // This is normal - backend should process the code and redirect back with token
          // Let's wait a moment for the backend to process
          setError("Processing your Google sign-in...");

          // The backend should handle this code and redirect back to us with a token
          // If we're still here after 5 seconds, something went wrong
          setTimeout(() => {
            if (!localStorage.getItem("auth_token")) {
              console.error(
                "Backend did not process OAuth2 code within 5 seconds"
              );
              setError(
                "Authentication is taking longer than expected. Backend may need configuration."
              );
              setLoading(false);
            }
          }, 5000);

          return;
        }

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
          } else if (error === "handler_error") {
            errorMessage =
              "Backend authentication handler error. Check backend logs for details. This usually means there's an issue with JWT token generation, database connection, or user creation in the backend.";
          } else if (error === "no_email") {
            errorMessage =
              "No email address received from Google. Please ensure your Google account has an email address.";
          } else if (error === "user_creation_failed") {
            errorMessage =
              "Failed to create or update user account. Please check backend database connection.";
          } else if (error === "token_generation_failed") {
            errorMessage =
              "Failed to generate authentication token. Please check backend JWT configuration.";
          } else if (error.startsWith("handler_error_")) {
            const errorType = error.replace("handler_error_", "");
            errorMessage = `Backend error: ${errorType}. Check backend logs for detailed stack trace.`;
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
          console.log("=== TOKEN PROCESSING START ===");
          console.log("OAuth2 token received, saving and redirecting...");
          console.log("Token length:", token.length);
          console.log("Token preview:", token.substring(0, 50) + "...");
          console.log("Full token:", token);

          try {
            console.log("Calling saveToken function...");
            saveToken(token);
            console.log("saveToken completed successfully");

            // Verify token was saved
            const savedToken = localStorage.getItem("auth_token");
            console.log(
              "Token saved to localStorage:",
              savedToken ? "Yes" : "No"
            );
            console.log(
              "Saved token preview:",
              savedToken ? savedToken.substring(0, 50) + "..." : "None"
            );

            // Set success state immediately
            console.log("Setting loading to false...");
            setLoading(false);

            // Redirect to account page immediately (remove setTimeout delay)
            console.log("Redirecting to /account immediately...");
            console.log(
              "Current location before navigation:",
              window.location.href
            );
            console.log(
              "Token in localStorage before navigation:",
              localStorage.getItem("auth_token") ? "present" : "missing"
            );

            navigate("/account", { replace: true });

            // Add additional logging after navigation attempt
            setTimeout(() => {
              console.log(
                "Navigation completed, current location:",
                window.location.href
              );
            }, 100);
          } catch (saveError) {
            console.error("Error saving token:", saveError);
            setError("Failed to save authentication token");
            setLoading(false);
          }
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
          <h3 className="font-semibold mb-2">Authentication Successful!</h3>
          <p>Token saved to localStorage. Redirecting to your account...</p>
          <p className="text-sm mt-2">Current URL: {window.location.href}</p>
          <p className="text-sm">
            Token present: {localStorage.getItem("auth_token") ? "Yes" : "No"}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          If you're not redirected automatically,{" "}
          <a href="/account" className="text-blue-500 underline">
            click here
          </a>
        </div>
      </div>
    </div>
  );
};

export default OAuth2LoginCallback;
