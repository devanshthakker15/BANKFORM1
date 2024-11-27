import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost } from "../utils/getApi";

// Define the async thunk for posting return data
export const manageReturns = createAsyncThunk(
  "returns/manage",
  async (returnData: { orderId: number; returns: any[] }, { rejectWithValue }) => {
    try {
      const response = await apiPost("/api/returns/manage/", returnData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

interface ReturnState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ReturnState = {
  status: "idle",
  error: null,
};

const returnSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(manageReturns.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(manageReturns.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(manageReturns.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default returnSlice.reducer;
