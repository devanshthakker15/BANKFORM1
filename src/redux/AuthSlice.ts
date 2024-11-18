// src/redux/AuthSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../utils/commonFunction";
import { apiGet } from "../utils/getApi";

export const loginUser = createAsyncThunk(
 "auth/login",
 async ({ email, password }: { email: string; password: string; }, thunkAPI) => {
   try {
     const response = await apiRequest("POST", "/api/account/login/", { email, password });
     const { access_token, refresh_token, user_details: user } = response.result;

     localStorage.setItem("access_token", access_token);
     localStorage.setItem("refresh_token", refresh_token);

     // Fetch permissions after successful login
     const permissionsResponse = await apiGet("/api/account/user/permissions/");
     const permissions = permissionsResponse.result.permissions;

     localStorage.setItem("permissions", JSON.stringify(permissions));  // Saving permissions to localStorage

     return { user, permissions };
   } catch (error: any) {
     return thunkAPI.rejectWithValue(error.response?.data.message || "Login failed");
   }
 }
);

const initialState = {
  user: null,
  permissions: JSON.parse(localStorage.getItem("permissions") || "[]"),  // Loading permissions from localStorage
  isAuthenticated: !!localStorage.getItem("access_token"),
  loading: false,
  loginError: null,
};

const authSlice = createSlice({
 name: "auth",
 initialState,
 reducers: {
   logout: (state) => {
     localStorage.removeItem("access_token");
     localStorage.removeItem("refresh_token");
     localStorage.removeItem("permissions");
     state.user = null;
     state.permissions = [];
     state.isAuthenticated = false;
   },
 },
 extraReducers: (builder) => {
   builder
     .addCase(loginUser.pending, (state) => {
       state.loading = true;
       state.loginError = null;
     })
     .addCase(loginUser.fulfilled, (state, action) => {
       state.user = action.payload.user;
       state.permissions = action.payload.permissions;
       state.isAuthenticated = true;
       state.loading = false;
     })
     .addCase(loginUser.rejected, (state, action) => {
       state.loading = false;
       state.loginError = action.payload;
     });
 },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
