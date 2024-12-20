  // src/redux/formSlice.ts
  import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
  import { apiGet, apiDelete, apiPut, submitBankFormData } from "../utils/getApi";
  import { BankFormValues } from "../components/BankForm";


  interface BankData {
    id: number;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_country: { country: string } | null;
    is_active: number;
    is_upi_available: number;
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



  // Updated thunk to accept page and query arguments (page working, query not working) (GET)
  export const fetchBankDataAsync = createAsyncThunk<
  { data: BankData[]; totalCount: number },
  { page: number; query: string },
  { rejectValue: string }
>("form/fetchBankDataAsync", async ({ page, query }, { rejectWithValue }) => {
  try {
    const data = await apiGet(`/api/payment/banks/?page=${page}&query=${query}`);
    if (data.success) {
      console.log("Bank Data:", data.result.results);
      return { data: data.result.results, totalCount: data.result.count };
    }
    return rejectWithValue("Failed to fetch bank data");
  } catch (error) {
    return rejectWithValue("Error fetching bank data");
  }
});


  // AsyncThunk for fetching bank details by ID (for editing) (GET)
  export const fetchBankByIdAsync = createAsyncThunk<
    BankData,
    number,
    { rejectValue: string }
  >("form/fetchBankByIdAsync", async (id, { rejectWithValue }) => {
    try {
      const data = await apiGet(`/api/payment/banks/${id}/`);
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch bank details");
    }
  });



  // AsyncThunk for deleting a bank record (DELETE)
  export const deleteBankAsync = createAsyncThunk<
    void,
    { id: number; page: number; query: string },
    { rejectValue: string }
  >("form/deleteBankAsync", async ({ id, page, query }, { dispatch, rejectWithValue }) => {
    try {
      await apiDelete(`/api/payment/banks/${id}/`);
      dispatch(removeBankById(id));
      // dispatch(fetchBankDataAsync({ page, query }));
    } catch (error) {
      return rejectWithValue("Failed to delete bank record");
    }
  });



  // AsyncThunk for toggling active status of a bank record (PUT)
  export const toggleBankActiveStatusAsync = createAsyncThunk<
    void,
    { id: number; currentStatus: number; page: number; query: string },
    { rejectValue: string }
  >("form/toggleBankActiveStatusAsync", async ({ id, currentStatus, page, query }, { dispatch, rejectWithValue }) => {
    const updatedStatus = currentStatus === 1 ? 0 : 1;
    try {
      await apiPut(`/api/payment/banks/${id}/`, { is_active: updatedStatus });
      dispatch(fetchBankDataAsync({ page, query }));
    } catch (error) {
      return rejectWithValue("Failed to toggle bank active status");
    }
  });


  // // AsyncThunk for toggling upi status of a bank record (PUT)
  // export const toggleUpiActiveStatusAsync = createAsyncThunk<
  //   void,
  //   { id: number; currentStatus: number; page: number; query: string },
  //   { rejectValue: string }
  // >("form/toggleUpiActiveStatusAsync", async ({ id, currentStatus, page, query }, { dispatch, rejectWithValue }) => {
  //   const updatedStatus = currentStatus === 1 ? 0 : 1;
  //   try {
  //     await apiPut(`/api/payment/banks/${id}/`, { is_upi_available: updatedStatus });
  //     dispatch(fetchBankDataAsync({ page, query }));
  //   } catch (error) {
  //     return rejectWithValue("Failed to toggle upi active status");
  //   }
  // });



  // AsyncThunk for updating or creating new bank data (PUT/POST)
  export const submitBankDataAsync = createAsyncThunk<
    void,
    { values: BankFormValues; id?: string },
    { rejectValue: string }
  >("form/submitBankDataAsync", async ({ values, id }, { rejectWithValue, dispatch }) => {
    try {
      if (id) {
        // Update bank data if id is provided
        await apiPut(`/api/payment/banks/${id}/`, values);
        console.log("Bank data updated successfully", values);
      } else {
        // Create new bank data if no id is provided
        await submitBankFormData(values);
        console.log("Bank data created successfully");
      }
      // Refresh the bank list after creating/updating
      // dispatch(fetchBankDataAsync({ page: 1, query: "" }));
    } catch (error) {
      return rejectWithValue("Failed to submit bank data");
    }
  });



  export const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
      removeBankById: (state, action: PayloadAction<number>) => {
        state.formData = state.formData.filter((bank) => bank.id !== action.payload);
        
      },
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
        .addCase(fetchBankDataAsync.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.formData = action.payload.data;
          state.totalCount = action.payload.totalCount;
        })
        .addCase(fetchBankDataAsync.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch bank data";
        })
        .addCase(fetchBankByIdAsync.fulfilled, (state, action) => {
          state.currentBank = action.payload;
        })
        .addCase(fetchBankByIdAsync.rejected, (state, action) => {
          state.error = action.payload || "Failed to fetch bank details";
        });
    },
  });

  export const { setCurrentBank, clearCurrentBank, saveFormData, removeBankById } = formSlice.actions;
  export default formSlice.reducer;
