import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const loginAPI = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: credentials.userName,
      password: credentials.password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerAPI = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmailAPI = async (verificationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, verificationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendVerificationCodeAPI = async (emailData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, emailData);
    return response.data;
  } catch (error) {
    throw error;
  }
};