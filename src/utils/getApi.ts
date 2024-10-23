
import axios from "axios";
import {BASE_URL} from "../utils/constants"

// const BASE_URL = "http://192.168.1.44:8001";

export const apiGet = async (url: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error; 
  }
};
