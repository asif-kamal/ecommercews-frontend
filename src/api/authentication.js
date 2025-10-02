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
    const response = await axios.post(`${API_BASE_URL}/auth/verify`, verificationData);
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

export const getUserProfileAPI = async (token) => {
  try {
    console.log('getUserProfileAPI - Request details:', {
      url: `${API_BASE_URL}/user/profile`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token ? token.substring(0, 20) + '...' : 'null'}`,
        'Content-Type': 'application/json'
      }
    });

    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('getUserProfileAPI - Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('getUserProfileAPI - Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });
    throw error;
  }
};

export const updateUserProfileAPI = async (token, userData) => {
  try {
    console.log('updateUserProfileAPI - Request details:', {
      url: `${API_BASE_URL}/user/profile`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token ? token.substring(0, 20) + '...' : 'null'}`,
        'Content-Type': 'application/json'
      },
      data: userData
    });

    const response = await axios.put(`${API_BASE_URL}/user/profile`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('updateUserProfileAPI - Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('updateUserProfileAPI - Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data
    });
    
    // If PUT fails, let's try some common alternative approaches
    if (error.response?.status === 500) {
      console.log('PUT failed with 500 error. This might be due to:');
      console.log('1. Backend endpoint expects different URL (e.g., /api/users/profile)');
      console.log('2. Backend expects PATCH instead of PUT');
      console.log('3. Backend expects different data format');
      console.log('4. Backend database constraint violation');
      console.log('5. Backend authentication/authorization issue');
    }
    
    throw error;
  }
};

// Alternative API endpoints to try if the main one fails
export const updateUserProfilePATCH = async (token, userData) => {
  try {
    console.log('Trying PATCH method instead of PUT...');
    const response = await axios.patch(`${API_BASE_URL}/user/profile`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('PATCH method also failed:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const updateUserProfileAltEndpoint = async (token, userData) => {
  try {
    console.log('Trying alternative endpoint /api/users/profile...');
    const response = await axios.put(`${API_BASE_URL}/users/profile`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Alternative endpoint also failed:', error.response?.status, error.response?.data);
    throw error;
  }
};