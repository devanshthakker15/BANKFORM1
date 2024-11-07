// src/utils/getApi.ts
import axios from "axios";
import { BASE_URL, USER_URL, PRODUCTS_URL } from "./constants";

// Get access token from local storage
const getAccessToken = () => localStorage.getItem("access_token") || "";

// Handle GET requests with token
export const apiGet = async (url: string, params = {}) => {
  const token = getAccessToken();
  if (!token) throw new Error("Access token is missing. Please log in.");

  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Handle GET requests for users
export const userGet = async (url: string) => {
  try {
    const response = await axios.get(`${USER_URL}${url}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


// Handle GET requests for users
export const productGet = async (url: string) => {
  try {
    const response = await axios.get(`${PRODUCTS_URL}${url}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Handle POST requests with token
export const apiPost = async (url: string, data: any) => {
  const token = getAccessToken();
  if (!token) throw new Error("Access token is missing. Please log in.");

  try {
    const response = await axios.post(`${BASE_URL}${url}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// PUT request function with token
export const apiPut = async (url: string, data: any) => {
  const token = getAccessToken();
  if (!token) throw new Error("Access token is missing. Please log in.");

  try {
    const response = await axios.put(`${BASE_URL}${url}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// DELETE request function with token
export const apiDelete = async (url: string) => {
  const token = getAccessToken();
  if (!token) throw new Error("Access token is missing. Please log in.");

  try {
    const response = await axios.delete(`${BASE_URL}${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Error handler function
const handleApiError = (error: any) => {
  if (error.response) {
    console.error(`API Error - Status: ${error.response.status}`, error.response.data);
  } else {
    console.error("API call failed:", error.message);
  }
  throw error;
};

// Fetch bank data by ID
export const apiGetBankDataById = async (id: string) => {
  const token = getAccessToken();
  if (!token) throw new Error("Access token is missing. Please log in.");

  try {
    const response = await axios.get(`${BASE_URL}/api/payment/banks/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bank data by ID:", error);
    throw error;
  }
};

// New Submit HSN Form Data Function
export const submitHSNFormData = async (formData: any) => {
  try {
    const response = await apiPost("/api/product/hsncodes/", formData);
    return response;
  } catch (error) {
    console.error("Error submitting HSN form data:", error);
    throw error;
  }
 };
 
 
 //SUBMIT FORM FUNCTION TO HANDLE THE SUBMISSION
 export const submitBankFormData = async (formData: any) => {
  try {
    const response = await apiPost("/api/payment/banks/", formData);
    return response;
  } catch (error) {
    console.error("Error submitting bank form data:", error);
    throw error;
  }
 };
 
 