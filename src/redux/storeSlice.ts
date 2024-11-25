import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet } from "../utils/getApi";

interface Store {
  id: number;
  store_name: string;
  store_code: string;
  contact_number: number;
  gstn: string;
}

// Define the state type
interface StoreState {
  stores: Store[];
  selectedStore: number | null; 
  loading: boolean;
  error: string | null;
  selectedStoreId: number | null; // Track the selected store
}

// Initial state
const initialState: StoreState = {
  stores: [],
  selectedStore: null,
  loading: false,
  error: null,
  selectedStoreId: null, // Initially, no store is selected
}

// Async thunk to fetch active stores
export const fetchActiveStores = createAsyncThunk(
  'store/fetchActiveStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGet('/api/store/manage/active/');
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
  initialState,
  reducers: {
    // Action to set the selected store
    setSelectedStore(state, action) {
      state.selectedStore = action.payload; // Update the selected store ID
    },
    setStores(state, action) {
      state.stores = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchActiveStores.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { setSelectedStore, setStores } = storeSlice.actions;
export default storeSlice.reducer;
