import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authService} from "@/service/AuthService";
import authReducer from "./reducers/AuthSlice";
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {chatService} from "@/service/chatService";

const rootReducer = combineReducers({
    [authService.reducerPath]: authService.reducer,
    [chatService.reducerPath]: chatService.reducer,
    auth: authReducer,
})

const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                authService.middleware,
                chatService.middleware
            ),
    })
}

export const store = setupStore();

// типи
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;