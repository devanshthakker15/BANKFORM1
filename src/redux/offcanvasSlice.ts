// src/redux/offcanvasSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPut, apiDelete} from "../utils/getApi";
import { FormData } from "../types/formTypes";

interface FormState {
  formData: FormData[];
  currentHSN: FormData | null;
  totalCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FormState = {
  formData: [],
  currentHSN: null,
  totalCount: 0,
  status: "idle",
  error: null,
};

// Thunk for fetching HSN codes (GET)
export const fetchHSNCodesAsync = createAsyncThunk<
  { data: FormData[]; totalCount: number },
  { page: number; query: string },
  { rejectValue: string }
>("offcanvas/fetchHSNCodesAsync", async ({ page , query}, { rejectWithValue }) => {
  try {
    const response = await apiGet(`/api/product/hsncodes/`, { page , q: query });
    return { data: response.result.results, totalCount: response.result.count };
  } catch (error) {
    return rejectWithValue("Failed to fetch HSN Codes");
  }
});

// Thunk for saving a new HSN code (POST)
export const saveHSNCodeAsync = createAsyncThunk(
  "offcanvas/saveHSNCode",
  async (data: FormData, { rejectWithValue }) => {
    try {
      console.log("Adding new HSN data");
      const response = await apiPost("/api/product/hsncodes/", data);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to save HSN Code");
    }
  }
);

// Thunk for updating an existing HSN code (PUT)
export const updateHSNCodeAsync = createAsyncThunk(
  "offcanvas/updateHSNCode",
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      console.log("Updating the HSN data");
      const response = await apiPut(`/api/product/hsncodes/${id}/`, data);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to update HSN Code");
    }
  }
);

// AsyncThunk for toggling active status of a HSN record (PUT)
export const toggleHSNActiveStatusAsync = createAsyncThunk<
  void,
  { id: number; currentStatus: number; page: number; query: string },
  { rejectValue: string }
>("form/toggleHSNActiveStatusAsync", async ({ id, currentStatus, page, query }, { dispatch, rejectWithValue }) => {
  const updatedStatus = currentStatus === 1 ? 0 : 1;
  try {
    await apiPut(`/api/product/hsncodes/${id}/`, { is_active: updatedStatus });
    dispatch(fetchHSNCodesAsync({ page, query }));
  } catch (error) {
    return rejectWithValue("Failed to toggle bank active status");
  }
});

// AsyncThunk for deleting a bank record (DELETE)
export const deleteHSNAsync = createAsyncThunk<
  void,
  { id: number; page: number; query: string },
  { rejectValue: string }
>("form/deleteHSNAsync", async ({ id, page, query }, { dispatch, rejectWithValue }) => {
  try {
    await apiDelete(`/api/product/hsncodes/${id}/`);
    dispatch(fetchHSNCodesAsync({ page, query }));
  } catch (error) {
    return rejectWithValue("Failed to delete bank record");
  }
});

const offcanvasSlice = createSlice({
  name: "offcanvas",
  initialState,
  reducers: {
    setCurrentHSN: (state, action: PayloadAction<FormData>) => {
      state.currentHSN = action.payload;
    },
    clearCurrentHSN: (state) => {
      state.currentHSN = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHSNCodesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHSNCodesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formData = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchHSNCodesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch HSN Codes";
      })
      .addCase(saveHSNCodeAsync.fulfilled, (state, action) => {
        state.formData.push(action.payload);
      })
      .addCase(updateHSNCodeAsync.fulfilled, (state, action) => {
        // Replace the updated HSN code in the formData array
        const index = state.formData.findIndex((item) => item.id === action.meta.arg.id);
        if (index !== -1) {
          state.formData[index] = action.payload;
        }
      });
  },
});

export const { setCurrentHSN, clearCurrentHSN } = offcanvasSlice.actions;
export default offcanvasSlice.reducer;
