import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet } from "../utils/getApi";

interface Store {
  id: number;
  store_name: string;
  store_code: string;
  contact_number: number;
  gstn: string;
}


// Async thunk to fetch active stores
export const fetchActiveStores = createAsyncThunk(
  'store/fetchActiveStores',
  async (_, { rejectWithValue }) => {
    try {
      // console.log("Fetching active stores..");
      const response = await apiGet('/api/store/manage/active/');
      // console.log("Store API Response:", response);
      return response.result;
    } catch (error) {
      console.error("Error fetching stores:", error);
      return rejectWithValue(error.message || 'Failed to fetch stores');
    }
  }
);

// Store slice
const storeSlice = createSlice({
  name: 'store',
  initialState: {
    stores: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveStores.pending, (state) => {
        state.loading = true;
        state.error = null;
        // console.log("Fetching stores: Pending...");
      })
      .addCase(fetchActiveStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
        // console.log("Fetching stores: Success. Data:", action.payload);
      })
      .addCase(fetchActiveStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        // console.error("Fetching stores: Failed. Error:", action.payload);
      });
  },
});

export default storeSlice.reducer;
