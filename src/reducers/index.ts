import { YellowBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

import appSlice from './slices';
import eventsSlice from '../features/events/slices';
import pharmaciesSlice from '../features/pharmacies/slices';
import newsSlice from '../features/news/slices';

// TODO: Remove, this shouldn't be necessary, I'm already using the new package.
YellowBox.ignoreWarnings(['Warning: AsyncStorage has been extracted']);

const getPersistConfig = key => ({
  key,
  storage: AsyncStorage,
});

// TODO: A blacklist for appSlice would be better
export default combineReducers({
  app: appSlice.reducer,
  events: persistReducer(getPersistConfig('events'), eventsSlice.reducer),
  pharmacies: persistReducer(
    getPersistConfig('pharmacies'),
    pharmaciesSlice.reducer
  ),
  news: persistReducer(getPersistConfig('news'), newsSlice.reducer),
});
