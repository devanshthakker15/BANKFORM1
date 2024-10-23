import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../utils/commonFunction';
import { NavigateFunction } from 'react-router-dom';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, navigate }: { email: string; password: string; navigate: NavigateFunction }, thunkAPI) => {
    try {
      console.log('Sending login request to API:', { email, password });

      const response = await apiRequest('POST', '/api/account/login/', { email, password });
      console.log('API login response:', response);

      // Access tokens and user data from response.result
      const { access_token, refresh_token, user_details: user, permissions } = response.result;

      // Store tokens in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      return { user, permissions };
    } catch (error) {
      console.log('Login request failed:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    permissions: [],
    isAuthenticated: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log('Login successful, updating state:', action.payload);
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      console.log('Login failed, error message:', action.payload);
    });
  },
});

export default authSlice.reducer;
