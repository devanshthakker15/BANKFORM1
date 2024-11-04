import axios from "axios";
import { BASE_URL, USER_URL } from "../utils/constants";

// Function to get the access token
const getAccessToken = () => localStorage.getItem("access_token");


// Function to handle GET requests
export const apiGet = async (url: string, params = {}, token?:string) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Access token is missing. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Common function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;
    console.error(`API Error - Status: ${status}, Response Data:`, data);
  } else {
    console.error("API call failed:", error.message);
  }
  throw error;
};


//Common API POST Function
export const apiPost = async (url: string, data: any) => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("Access token is missing. Please log in.");
    console.log("Access Token:", token); 
    console.log("Making POST request to:", BASE_URL + url);
    console.log("Request Data:", data);
    const response = await axios.post(`${BASE_URL}${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("POST response data:", response.data); // Log API response data
    return response.data;
  } catch (error) {
    handleApiError(error);
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

export const apiPut = async (url: string, data: any, token?: string) => {
  try {
    if (!token) throw new Error("Access token is missing. Please log in.");

    const response = await axios.put(`${BASE_URL}${url}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error in PUT request:", error);
    throw error;
  }
};




export const apiGetBankDataById = async (id: string) => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("Access token is missing. Please log in.");

    const response = await axios.get(`${BASE_URL}/api/payment/banks/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bank data by ID:", error);
    throw error;
  }
};



// Common function for DELETE request
export const apiDelete = async (url: string, token: string) => {
  try {
    const token = getAccessToken();
    console.log(`Making DELETE request to: ${url}`);
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Log success message and response data
    console.log(`DELETE request successful. Response data:`, response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error in DELETE request:', error);
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


// export const apiGetBankDataById = async (id: string) => {
//   const token = getAccessToken();
//   const response = await axios.get(`${BASE_URL}/api/payment/banks/${id}/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };


export const getUsers = async () =>{
  const response = await axios.get(`${USER_URL}/users`);
  return response.data;
};


//Common API PUT Function
// export const apiPut = async (url: string, data:any) => {
//   try{
//     const token = getAccessToken();
//     if (!token) throw new Error("Access token missing. please log in.");
//     console.log("Access token for put:", token);
//     console.log("making PUT request to:", BASE_URL + url);
//     console.log("Put request data:", data);
//     const response = await axios.put(`${BASE_URL}${url}`,data,{
//       headers:{
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("PUT request response data:", response.data);
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };






















































// Function to handle POST requests
// export const apiPost = async (url: string, data: any) => {
//   try {
//     const token = getAccessToken();
//     if (!token) {
//       throw new Error("Access token is missing. Please log in.");
//     }

//     const response = await axios.post(`${BASE_URL}${url}`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };




// export const apiPost = async (url: string, data: any) => {
//   try {
//     const token = getAccessToken();
//     if (!token) throw new Error("Access token is missing. Please log in.");

//     console.log("Making POST request to:", url);
//     const response = await axios.post(`${BASE_URL}${url}`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("POST response data:", response.data);
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };

// // Function to submit the bank form data
// export const submitBankFormData = async (formData: any) => {
//   try {
//     const url = "/api/payment/banks/"; 
//     const response = await apiPost(url, formData);
//     return response;
//   } catch (error) {
//     console.error("Error submitting bank form data:", error);
//     throw error;
//   }
// };
