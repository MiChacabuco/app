import { persistStore } from 'redux-persist';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import rootReducer from './reducers';

// Setup redux-persist
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    // https://github.com/rt2zz/redux-persist/issues/988
    serializableCheck: false,
  }),
});
export const persistor = persistStore(store);
