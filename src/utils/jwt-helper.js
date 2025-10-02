const TOKEN_KEY = 'auth_token';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  console.log("JWT Helper: Checking authentication...");
  console.log("JWT Helper: Token exists:", token ? "Yes" : "No");

  if (!token) {
    console.log("JWT Helper: No token found");
    return false;
  }

  try {
    // Basic token validation - check if it's not expired
    console.log("JWT Helper: Attempting to parse token...");
    const parts = token.split('.');
    console.log("JWT Helper: Token parts count:", parts.length);

    if (parts.length !== 3) {
      console.error("JWT Helper: Invalid token format - should have 3 parts");
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    console.log("JWT Helper: Token payload:", payload);

    const currentTime = Date.now() / 1000;
    console.log("JWT Helper: Current time:", currentTime);
    console.log("JWT Helper: Token exp:", payload.exp);
    console.log("JWT Helper: Token valid:", payload.exp > currentTime);

    return payload.exp > currentTime;
  } catch (error) {
    console.error('JWT Helper: Error validating token:', error);
    console.error('JWT Helper: Token that failed:', token);
    return false;
  }
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      // Add other user properties as needed
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};