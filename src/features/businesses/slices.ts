import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BusinessesState {
  searchValue: string;
  isSearchActive: boolean;
}

const initialState: BusinessesState = {
  searchValue: '',
  isSearchActive: false,
};

export const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    search(state: BusinessesState, payload: PayloadAction<string>) {
      state.searchValue = payload.payload;
    },
    activateSearch(state: BusinessesState) {
      state.isSearchActive = true;
    },
    deactivateSearch(state: BusinessesState) {
      state.isSearchActive = false;
    },
  },
});
