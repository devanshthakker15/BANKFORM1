// redux/store.tsx
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
  },
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
