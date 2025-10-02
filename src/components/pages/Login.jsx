import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "../Buttons/GoogleSignIn";
import { loginAPI } from "../../api/authentication";
import { saveToken } from "../../utils/jwt-helper";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const loginData = {
        userName: formData.email, // Backend expects 'userName' field
        password: formData.password
      };

      console.log("Sending login data:", loginData);

      // Call the backend API
      const response = await loginAPI(loginData);

      console.log("Login response:", response);

      // Check if we received the JWT token
      if (response?.token) {
        // Save the JWT token
        saveToken(response.token);
        console.log("JWT token saved successfully");
        
        // Redirect to account page
        alert("Login successful! Welcome back!");
        navigate("/account");
      } else {
        setError("Login failed. No token received.");
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.response?.status === 403) {
        setError("Account not verified. Please check your email for verification code.");
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Google Sign In */}
        <div className="mb-4">
          <GoogleSignIn context="login" />
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>        <div className="text-center">
          <p className="text-gray-600 mb-4">Don't have an account?</p>
          <button
            onClick={handleRegisterClick}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
