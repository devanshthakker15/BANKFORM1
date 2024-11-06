// src/redux/employeeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGet } from "../utils/getApi";

interface Employee {
  id: number;
  name: string;
  username: string;
  email: string;
  company_name: string;
}

interface EmployeeState {
  employees: Employee[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalCount: number;
}

const initialState: EmployeeState = {
  employees: [],
  status: "idle",
  error: null,
  totalCount: 0,
};

// Thunk for fetching employee data with pagination
export const fetchEmployeeDataAsync = createAsyncThunk<
  { data: Employee[]; totalCount: number },
  { page: number; query: string },
  { rejectValue: string }
>("employee/fetchEmployeeDataAsync", async ({ page, query }, { rejectWithValue }) => {
  try {
    const data = await apiGet(`/users`, { page, q: query });
    if (data.success) {
      return { data: data.result.results, totalCount: data.result.count };
    }
    return rejectWithValue("Failed to fetch employee data");
  } catch (error) {
    return rejectWithValue("Error fetching employee data");
  }
});

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearEmployees: (state) => {
      state.employees = [];
      state.totalCount = 0;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDataAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployeeDataAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchEmployeeDataAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch employee data";
      });
  },
});

export const { clearEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
