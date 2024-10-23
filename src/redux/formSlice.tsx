import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { apiGet } from "../utils/getApi";

// Define interface for bank data
interface BankData {
  id: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_country: {
    country: string;
  } | null;
}

// Define the initial state
interface FormState {
  formData: BankData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FormState = {
  formData: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch bank data from the API
export const fetchBankDataAsync = createAsyncThunk<
  BankData[],
  void,
  { rejectValue: string }
>("form/fetchBankDataAsync", async (_, { rejectWithValue }) => {
  try {
    // Retrieve access token from localStorage
    const accessToken = localStorage.getItem("access_token");

    // Add the access token to the request headers
    

    const data = await apiGet("/api/payment/banks/");

    if (data.success) {
      return data.result.results; // Return bank data
    } else {
      return rejectWithValue("Failed to fetch bank data");
    }
  } catch (error) {
    return rejectWithValue("Error fetching bank data");
  }
});

// Create form slice
const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankDataAsync.pending, (state) => {
        console.log("Fetching bank data - status: loading");
        state.status = "loading";
      })
      .addCase(fetchBankDataAsync.fulfilled, (state, action: PayloadAction<BankData[]>) => {
        console.log("Fetching bank data - status: succeeded");
        state.status = "succeeded";
        state.formData = action.payload;
        console.log("Fetched data:", action.payload);
      })
      .addCase(fetchBankDataAsync.rejected, (state, action) => {
        console.log("Fetching bank data - status: failed");
        state.status = "failed";
        state.error = action.payload || "Failed to fetch bank data";
        console.error("Error message:", state.error);
      });
  },
});

export default formSlice.reducer;
