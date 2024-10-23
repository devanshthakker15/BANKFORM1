// redux/store.tsx
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import authReducer from "./AuthSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authReducer,
  },
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
