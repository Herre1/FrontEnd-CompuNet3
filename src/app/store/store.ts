// src/app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./contentSlice";

const store = configureStore({
  reducer: {
    content: contentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;