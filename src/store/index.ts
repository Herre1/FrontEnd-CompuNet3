import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counter/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        counter: counterSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export  const useAppDispatch:  () =>  AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState>  = useSelector;