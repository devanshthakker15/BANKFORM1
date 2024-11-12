import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../utils/getApi";

interface LocationState {
 countries: { value: number; label: string }[];
 states: { value: number; label: string }[];
 cities: { value: number; label: string }[];
 status: "idle" | "loading" | "succeeded" | "failed";
 error: string | null;
}

const initialState: LocationState = {
 countries: [],
 states: [],
 cities: [],
 status: "idle",
 error: null,
};

// Async thunk to fetch countries
export const fetchCountries = createAsyncThunk("location/fetchCountries", async () => {
 const response = await apiGet("/api/location/country/");
 return response.result.map((country) => ({
   value: country.id,
   label: country.country,
 }));
});

// Async thunk to fetch states based on country_id
export const fetchStates = createAsyncThunk("location/fetchStates", async (countryId: number) => {
 const response = await apiGet(`/api/location/state/${countryId}/`);
 return response.result.map((state) => ({
   value: state.id,
   label: state.state,
 }));
});

// Async thunk to fetch cities based on state_id
export const fetchCities = createAsyncThunk("location/fetchCities", async (stateId: number) => {
 const response = await apiGet(`/api/location/city/${stateId}/`);
 return response.result.map((city) => ({
   value: city.id,
   label: city.city,
 }));
});

const locationSlice = createSlice({
 name: "location",
 initialState,
 reducers: {

  setCountry:(state,action)=>{
    state.countries=action.payload
  }
 },
 extraReducers: (builder) => {
   builder
     .addCase(fetchCountries.fulfilled, (state, action) => {
       state.countries = action.payload;
     })
     .addCase(fetchStates.fulfilled, (state, action) => {
       state.states = action.payload;
     })
     .addCase(fetchCities.fulfilled, (state, action) => {
       state.cities = action.payload;
     });
 },
});

export default locationSlice.reducer;
