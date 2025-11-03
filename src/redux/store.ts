// redux/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slice/languageSlice";
import userDataReducer from "./slice/userSlice";
import invoiceDataReducer from "./slice/invoiceSlice"
import sidebarReducer from "./slice/sidebarSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const languagePersistConfig = {
  key: "language",
  storage,
};

const rootReducer = combineReducers({
  language: persistReducer(languagePersistConfig, languageReducer),
  user: userDataReducer,
  invoiceData : invoiceDataReducer,
  sidebar: sidebarReducer
});

const persistedReducer = rootReducer;
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
