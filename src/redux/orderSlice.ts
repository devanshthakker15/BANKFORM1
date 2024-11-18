import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../utils/getApi";

interface Order {
    id: number;
    invoice_code: string;
    customer: {
      id: number;
      name: string;
      // ...other customer properties
    };
    bill_amount: number;
    payable_amount: number;
    payment_type: number;
    status: string;
    created_at: string;
    products: {
      // ...product properties
    }[];
    // ...other order properties
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

// Async thunk to fetch orders
// export const fetchOrders = createAsyncThunk<
// { data: Order[]; totalCount: number },
// { page: number; query: string },
// { rejectValue: string }
// >("orders/fetchOrders", async ({ page, query }, { rejectWithValue }) => {
//   try {
//     const params = new URLSearchParams();
//     params.append('page', page.toString());

//     if (query) {
//       params.append('query', query);
//     }

//     const url = `/api/orders/manage?${params.toString()}`;
//     const data = await apiGet(url);

//     if (data.success) {
//       console.log("Fetched Orders:", data.result.results);
//     //   return data.result.results;
//       return { data: data.result.results, totalCount: data.result.count };
//     }
//     return rejectWithValue("Failed to fetch orders");
//   } catch (error) {
//     return rejectWithValue("Error fetching orders");
//   }
// });

export const fetchOrders = createAsyncThunk<
{data: Order[]; totalCount:number},
{page:number; query:string;},
{rejectValue: string}
>("orders/fetchOrders", async ({page, query}, {rejectWithValue}) =>{
    try{
        const data = await apiGet(`/api/orders/manage/?page=${page}&query=${query}`);
        if(data.success) {
            console.log("Orders Fetched:", data.result.results);
            return { data: data.result.results, totalCount: data.result.count };
        }
        return rejectWithValue("Failed to fetch orders data");
    } catch (error) {
        return rejectWithValue("Error fetching bank data");
    }
});

// export const fetchBankDataAsync = createAsyncThunk<
// { data: BankData[]; totalCount: number },
// { page: number; query: string },
// { rejectValue: string }
// >("form/fetchBankDataAsync", async ({ page, query }, { rejectWithValue }) => {
// try {
//   const data = await apiGet(`/api/payment/banks/?page=${page}&query=${query}`);
//   if (data.success) {
//     console.log("Bank Data:", data.result.results);
//     return { data: data.result.results, totalCount: data.result.count };
//   }
//   return rejectWithValue("Failed to fetch bank data");
// } catch (error) {
//   return rejectWithValue("Error fetching bank data");
// }
// });


const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default orderSlice.reducer;
