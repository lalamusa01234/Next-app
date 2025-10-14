import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "../features/itemSlice";
import userReducer from "../features/userSlice";

export const store = configureStore({
  reducer: {
    items: itemReducer,   // keep naming consistent (not "items" if your slice is "item")
    user: userReducer,
  },
});

// Types for TS + hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
