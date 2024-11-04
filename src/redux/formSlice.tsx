// src/redux/formSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../utils/getApi";

interface BankData {
  id: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_country: { country: string } | null;
  is_active: number;
}

interface FormState {
  formData: BankData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  currentBank: BankData | null;
  countries: [];
  error: string | null;
  totalCount: number;
}

const initialState: FormState = {
  formData: [],
  status: "idle",
  currentBank: null,
  countries: [],
  error: null,
  totalCount: 0,
};

// Updated thunk to accept page and query arguments
export const fetchBankDataAsync = createAsyncThunk<
  { data: BankData[]; totalCount: number },
  { page: number; query: string },
  { rejectValue: string }
>("form/fetchBankDataAsync", async ({ page, query }, { rejectWithValue }) => {
  try {
    const data = await apiGet(`/api/payment/banks/`, { page, q: query });
    if (data.success) {
      return { data: data.result.results, totalCount: data.result.count };
    }
    return rejectWithValue("Failed to fetch bank data");
  } catch (error) {
    return rejectWithValue("Error fetching bank data");
  }
});

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setCurrentBank: (state, action: PayloadAction<BankData | null>) => {
      state.currentBank = action.payload;
    },
    clearCurrentBank: (state) => {
      state.currentBank = null;
    },
    saveFormData: (state, action: PayloadAction<BankData>) => {
      state.formData.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankDataAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchBankDataAsync.fulfilled,
        (state, action: PayloadAction<{ data: BankData[]; totalCount: number }>) => {
          state.status = "succeeded";
          state.formData = action.payload.data;
          state.totalCount = action.payload.totalCount;
        }
      )
      .addCase(fetchBankDataAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch bank data";
      });
  },
});

export const { setCurrentBank, clearCurrentBank, saveFormData } = formSlice.actions;
export default formSlice.reducer;
