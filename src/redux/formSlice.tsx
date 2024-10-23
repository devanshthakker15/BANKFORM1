import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface FormData {
  bankName: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
  accountNumber: string;
  email: string;
  addresses: Address[];
  id?: number;
}

interface FormState {
  formData: FormData[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: FormState = {
  formData: [],
  status: "idle",
};

export const saveFormDataAsync = createAsyncThunk<
  FormData,
  FormData,
  { rejectValue: string }
>("form/saveFormDataAsync", async (formData, { rejectWithValue }) => {
  try {
    return new Promise<FormData>((resolve) => {
      setTimeout(() => resolve(formData), 2000);
    });
  } catch (error) {
    return rejectWithValue("Failed to save form data");
  }
});

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addFormData: (state, action: PayloadAction<FormData>) => {
      state.formData.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveFormDataAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveFormDataAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formData.push(action.payload);
      })
      .addCase(saveFormDataAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addFormData } = formSlice.actions;
export default formSlice.reducer;


