// redux/store.tsx
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import authReducer from "./AuthSlice";
import locationReducer from "./locationSlice"
import offcanvasReducer from "./offcanvasSlice"


export const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authReducer,
    location: locationReducer,
    offcanvas: offcanvasReducer,
  },
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;