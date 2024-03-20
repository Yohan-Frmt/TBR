import {compose, configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {rootReducer} from "./Reducer/reducers";

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk] as const,
});
