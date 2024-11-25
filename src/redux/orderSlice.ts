import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../utils/getApi";

interface Order {
  id: number;
  invoice_code: string;
  customer: {
    id: number;
    name: string;
    contact_number: string;
    email: string;
    company_name: string;
  };
  employee:{
    first_name: string,
    last_name: string,
    account_holder: string
  }
  customer_name?: string;
  bill_amount: number;
  order_invoice_number: number;
  payable_amount: number;
  payment_type: {
    payment_type: string;
  }
  status: string;
  created_at: string;
  products: any[];
  delivery_type: string;
  discount_value: number;
  total_tax:number;
  unit_price:number;
}

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalCount: number;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
  totalCount: 0,
};

// Fetch a specific order's last bill by ID
export const fetchLastBillById = createAsyncThunk<
  any,
  { billId: number },
  { rejectValue: string }
>("orders/fetchLastBillById", async ({ billId }, { rejectWithValue }) => {
  try {
    const response = await apiGet(`/api/orders/manage/last/bill/?bill=${billId}`);
    if (response.success) {
      return response.result.bill;
    }
    return rejectWithValue("Failed to fetch bill data");
  } catch (error) {
    return rejectWithValue("Error fetching bill data");
  }
});

// Fetch Orders without Filters (default display)
export const fetchOrders = createAsyncThunk<
  { data: Order[]; totalCount: number },
  { page: number },
  { rejectValue: string }
>("orders/fetchOrders", async ({ page }, { rejectWithValue }) => {
  try {
    const data = await apiGet(`/api/orders/manage/?page=${page}`);
    if (data.success) {
      return { data: data.result.results, totalCount: data.result.count };
    }
    return rejectWithValue("Failed to fetch orders data");
  } catch (error) {
    return rejectWithValue("Error fetching orders data");
  }
});

// Fetch orders by ID
export const fetchOrdersById = createAsyncThunk<
  Order,
  { id: number },
  { rejectValue: string }
>("orders/fetchOrdersById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await apiGet(`/api/orders/manage/${id}`);
    if (response.success) {
      const order = response.result;
      console.log("Fetched order", order)
      return order;
    }
    return rejectWithValue("Failed to fetch order details");
  } catch (error) {
    return rejectWithValue("Error fetching order details");
  }
});


// Fetch Orders with Filters
export const fetchOrdersWithFilters = createAsyncThunk<
  { data: Order[]; totalCount: number },
  {
    page: number;
    query?: string;
    store?: number; 
    order_status?: string;
    delivery_type?: string;
    payment_type?: string;
    start_date?: string;
    end_date?: string;
    code?: string;
  },
  { rejectValue: string }
>("orders/fetchOrdersWithFilters", async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      ...(params.query && { query: params.query }),
      ...(params.order_status && { order_status: params.order_status }),
      ...(params.delivery_type && { delivery_type: params.delivery_type }),
      ...(params.start_date && { start_date: params.start_date }),
      ...(params.end_date && { end_date: params.end_date }),
      ...(params.code && { code: params.code }),
    });

    if (params.store) {
      queryParams.append("store[]", params.store.toString());
    }
    const data = await apiGet(`/api/orders/manage/filter/?${queryParams.toString()}`);
    
    if (data.success) {
      return { data: data.result.results, totalCount: data.result.count };
    }

    return rejectWithValue("Failed to fetch orders data");
  } catch (error) {
    return rejectWithValue("Error fetching orders data");
  }
});




const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Fetch Orders with Filters
      .addCase(fetchOrdersWithFilters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersWithFilters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchOrdersWithFilters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Fetch Last Bill By ID
      .addCase(fetchLastBillById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLastBillById.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchLastBillById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //Fetch Orders by id
      .addCase(fetchOrdersById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = [action.payload]; 
      })
      .addCase(fetchOrdersById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error fetching order details";
      });
  },
});

export default orderSlice.reducer;
