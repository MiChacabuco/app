import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { admin } from '../../utils';
import { AdminPaginatedResponse } from '../../models/response';
import { PharmacyShift } from './models/pharmacy-shift';
import { PharmaciesState } from './models/pharmacies-state';
import { AdminRequestParams } from '../../models/request-params';

const initialState: PharmaciesState = {
  shifts: [],
};

const pharmaciesSlice = createSlice({
  name: 'pharmacies',
  initialState,
  reducers: {
    fetchShiftsSuccess(state, action: PayloadAction<PharmacyShift[]>) {
      state.shifts = action.payload;
    },
  },
});

const { actions } = pharmaciesSlice;

const fetchShifts = (params: AdminRequestParams = {}) => (
  dispatch
): Promise<AdminPaginatedResponse<PharmacyShift>> => {
  const url = '/pharmacy-shifts/';
  return admin
    .get(url, { params })
    .then((response: { body: { pharmacyShifts: PharmacyShift[] } }) => {
      dispatch(actions.fetchShiftsSuccess(response.body.pharmacyShifts));
    })
    .catch(e => console.log(e));
};

actions['fetchShifts'] = fetchShifts;

export default pharmaciesSlice;
