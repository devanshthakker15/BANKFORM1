// src/redux/offcanvasSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../utils/getApi";
import { FormData } from "../types/formTypes";

interface FormState {
  formData: FormData[];
  currentHSN: FormData | null;
  totalCount: number;
}

const initialState: FormState = {
  formData: [],
  currentHSN: null,
  totalCount: 0,
};

export const fetchHSNCodesAsync = createAsyncThunk(
  "offcanvas/fetchHSNCodes",
  async ({ page }: { page: number }) => {
    const response = await apiGet(`/api/product/hsncodes/?page=${page}`);
    const data = response.result.results || [];
    // console.log("Fetched HSN Codes:", data);
    return { data, total_count: response.result.total_count || 0 };
  }
);

// export const fetchBankDataAsync = createAsyncThunk<
//   { data: BankData[]; totalCount: number },
//   { page: number; query: string },
//   { rejectValue: string }
// >("form/fetchBankDataAsync", async ({ page, query }, { rejectWithValue }) => {
//   try {
//     const data = await apiGet(`/api/payment/banks/`, { page, q: query });
//     if (data.success) {
//       return { data: data.result.results, totalCount: data.result.count };
//     }
//     return rejectWithValue("Failed to fetch bank data");
//   } catch (error) {
//     return rejectWithValue("Error fetching bank data");
//   }
// });

export const saveHSNCodeAsync = createAsyncThunk(
  "offcanvas/saveHSNCode",
  async (data: FormData) => {
    const response = await apiPost("/api/product/hsncodes/", data);
    console.log("Saved HSN Code:", response);
    return response;
  }
);

const offcanvasSlice = createSlice({
  name: "offcanvas",
  initialState,
  reducers: {
    setCurrentHSN(state, action: PayloadAction<FormData>) {
      state.currentHSN = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHSNCodesAsync.fulfilled, (state, action) => {
        console.log("HSN Codes Fetched Successfully");
        state.formData = action.payload.data;
        state.totalCount = action.payload.total_count;
      })
      .addCase(saveHSNCodeAsync.fulfilled, (state, action) => {
        console.log("HSN Code Added to State:", action.payload.data);
        state.formData.push(action.payload.data);
      });
  },
});

export const { setCurrentHSN } = offcanvasSlice.actions;
export default offcanvasSlice.reducer;
