import axios from 'axios';
import { redirectToLogin } from '../utils/redirectToLogin';
import { BASE_URL } from '../utils/constants';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Get access token from localStorage
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Function to initialize the API client with navigate
export const initializeApiClient = (navigate: () => void) => {
  // Interceptor to add access token to requests
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
    
      if (!token) {
        // If the token is missing, redirect to login
        redirectToLogin('Access token missing. Please log in again.', navigate);
        return Promise.reject('Access token missing.'); // Prevent the request from being sent
      }

      // If token is available, attach it to the request
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      console.log('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor to handle token refreshing on 401 errors
  apiClient.interceptors.response.use(
    (response) => {
      console.log('API request successful:', response);
      return response;
    },
    async (error) => {
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true;

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          redirectToLogin('Session expired. Please log in again.', navigate);
          return Promise.reject('Refresh token missing. Redirecting to login.');
        }

        try {
          const newAccessToken = await refreshAccessToken(navigate);
          apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log('Access token refreshed, retrying request...');
          return apiClient(error.config);
        } catch (refreshError) {
          redirectToLogin('Token refresh failed. Please log in again.', navigate);
          return Promise.reject(refreshError);
        }
      }

      if (error.response.status === 403) {
        redirectToLogin('Unauthorized access. Please log in.', navigate);
      }

      console.log('Response error:', error);
      return Promise.reject(error);
    }
  );
};

// Helper function to refresh the access token
const refreshAccessToken = async (navigate: () => void) => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    redirectToLogin('Refresh token missing. Please log in again.', navigate);
    throw new Error('Refresh token missing.');
  }

  const response = await axios.post(`${BASE_URL}/api/account/user/refresh`, {
    refresh_token: refreshToken,
  });

  const { access_token, refresh_token } = response.data;

  if (!access_token || !refresh_token) {
    redirectToLogin('Invalid token response. Please log in again.', navigate);
    throw new Error('Invalid token response.');
  }

  // Save the new tokens in localStorage
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);

  return access_token;
};

export default apiClient;
