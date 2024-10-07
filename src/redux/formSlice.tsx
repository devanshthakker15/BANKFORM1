import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';




interface FormData {
 bankName: string;
 accountHolderName: string;
 accountNumber: string;
}




interface FormState {
 formData: FormData | null;
 status: 'idle' | 'loading' | 'succeeded' | 'failed';
 error: string | null;
}




const initialState: FormState = {
 formData: null,
 status: 'idle',
 error: null,
};




export const saveFormDataAsync = createAsyncThunk<
 FormData,
 FormData,
 { rejectValue: string }
>(
 'form/saveFormDataAsync',
 async (formData, { rejectWithValue }) => {
   try {
     return new Promise<FormData>((resolve) => {
       setTimeout(() => resolve(formData), 4000);
     });
   } catch (error) {
     return rejectWithValue('Failed to save form data');
   }
 }
);




const formSlice = createSlice({
 name: 'form',
 initialState,
 reducers: {},
 extraReducers: (builder) => {
   builder
     .addCase(saveFormDataAsync.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(saveFormDataAsync.fulfilled, (state, action: PayloadAction<FormData>) => {
       state.status = 'succeeded';
       state.formData = action.payload;
     })
     .addCase(saveFormDataAsync.rejected, (state, action: PayloadAction<string | undefined>) => {
       state.status = 'failed';
       state.error = action.payload || null;
     });
 },
});


export default formSlice.reducer;
