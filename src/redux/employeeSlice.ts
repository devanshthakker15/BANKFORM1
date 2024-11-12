// src/redux/employeeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGet, userGet } from "../utils/getApi";

interface Employee {
  id: number;
  name: string;
  username: string;
  email: string;
  company_name: string;
}

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null; 
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalCount: number;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null, 
  status: "idle",
  error: null,
  totalCount: 0,
};

export const fetchEmployeeDataAsync = createAsyncThunk<
  { data: Employee[]; totalCount: number },
  void,
  { rejectValue: string }
>("employee/fetchEmployeeDataAsync", async (_, { rejectWithValue }) => {
  try {
    const data = await userGet(`/users`);
    if (data.success) {
      return { data: data.result.results, totalCount: data.result.count };
    } else {
      return rejectWithValue("Failed to fetch employee data");
    }
  } catch (error) {
    return rejectWithValue("Error fetching employee data");
  }
});

export const fetchEmployeeByIdAsync = createAsyncThunk<
  Employee,
  number, 
  { rejectValue: string }
>("form/fetchEmployeeByIdAsync", async (id, { rejectWithValue }) => {
  try {
    const data = await userGet(`/users/${id}/`);
    console.log(data);
    return data;
  } catch (error) {
    return rejectWithValue("Failed to fetch employee details");
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
      .addCase(fetchEmployeeDataAsync.fulfilled, (state, action: PayloadAction<{ data: Employee[]; totalCount: number }>) => {
        state.status = "succeeded";
        state.employees = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchEmployeeByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch employee details";
      });
  },
});

export const { clearEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
