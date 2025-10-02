import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfileAPI,
  updateUserProfileAPI,
} from "../../api/authentication";
import { getToken, removeToken, isAuthenticated } from "../../utils/jwt-helper";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Fetching user profile...");
      const profileData = await getUserProfileAPI(token);
      console.log("Profile data received:", profileData);

      setUserProfile({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);

      if (error.response?.status === 401) {
        // Token expired or invalid
        removeToken();
        navigate("/login");
      } else {
        setError("Failed to load profile information. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    fetchUserProfile();
  }, [navigate, fetchUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Updating user profile:", userProfile);
      const updatedProfile = await updateUserProfileAPI(token, userProfile);
      console.log("Profile updated successfully:", updatedProfile);

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);

      // Update local state with server response if needed
      if (updatedProfile) {
        setUserProfile((prev) => ({
          ...prev,
          ...updatedProfile,
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response?.status === 401) {
        removeToken();
        navigate("/login");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccessMessage("");
    // Reset form to original values
    fetchUserProfile();
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm mb-6">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={userProfile.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your first name"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {userProfile.firstName || "Not provided"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={userProfile.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your last name"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {userProfile.lastName || "Not provided"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
              {userProfile.email || "Not provided"}
              <span className="text-xs text-gray-500 block mt-1">
                Email cannot be changed
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={userProfile.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800">
                {userProfile.phoneNumber || "Not provided"}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Account Information
          </h2>
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <span className="font-medium">Account Status:</span> Active
            </p>
            <p>
              <span className="font-medium">Member Since:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
