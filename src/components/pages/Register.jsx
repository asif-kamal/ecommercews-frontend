import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "../Buttons/GoogleSignIn";
import { registerAPI } from "../../api/authentication";
import { saveToken, isAuthenticated } from "../../utils/jwt-helper";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already authenticated and redirect to account page
  useEffect(() => {
    console.log(
      "Register component: Checking if user is already authenticated..."
    );
    if (isAuthenticated()) {
      console.log(
        "Register component: User is already authenticated, redirecting to account page"
      );
      navigate("/account", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for backend API
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        // Remove confirmPassword as backend doesn't need it
      };

      console.log("Sending registration data:", registrationData);

      // Call the backend API
      const response = await registerAPI(registrationData);

      console.log("Registration response:", response);

      // If registration successful and returns a token
      if (response?.token) {
        saveToken(response.token);
        alert("Registration successful! Welcome!");
        navigate("/account"); // Go directly to account page
      } else {
        // If successful but no token (need email verification)
        alert(
          "Registration successful! Please check your email for verification code."
        );
        navigate("/verify-email", {
          state: { email: formData.email },
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 409) {
        setError(
          "Email already exists! Please use a different email or login."
        );
      } else if (error.response?.status === 400) {
        setError("Invalid registration data. Please check your inputs.");
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {/* Google Sign In */}
        <div className="mb-4">
          <GoogleSignIn context="register" />
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded mb-4 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <button
            onClick={handleBackToLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
