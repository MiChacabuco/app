import { Linking } from 'react-native';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GeoOptions,
  GeoPosition,
  PositionError,
} from 'react-native-geolocation-service';

import { GeolocationHelper } from '../helpers/GeoLocationHelper';
import { Business } from '../features/businesses/models/business';

export interface SnackbarState {
  text: string;
  type: 'success' | 'error' | 'info';
  isVisible?: boolean;
  action?: {
    label: string;
    onPress: () => any;
  };
}

export interface MainState {
  fabBusiness: Business;
  snackbar: SnackbarState;
  currentPosition: GeoPosition;
}

const initialState: MainState = {
  fabBusiness: null,
  snackbar: {
    text: '',
    isVisible: false,
    type: 'info',
  },
  currentPosition: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFabBusiness(state, action: PayloadAction<Business>) {
      state.fabBusiness = action.payload;
    },
    showSnackbar(state, action: PayloadAction<SnackbarState>) {
      state.snackbar = {
        ...action.payload,
        isVisible: true, // Force visible
      };
    },
    hideSnackbar(state) {
      state.snackbar.isVisible = false;
    },
    saveCurrentPosition(state, action: PayloadAction<GeoPosition>) {
      state.currentPosition = action.payload;
    },
  },
});

const defaultGeoOptions: GeoOptions = {
  timeout: 5000, // 5 seconds
  maximumAge: 0, // Don't cache
};

const getNetworkPosition = (): Promise<GeoPosition> => {
  const options: GeoOptions = {
    ...defaultGeoOptions,
    enableHighAccuracy: false, // Network
  };

  return GeolocationHelper.getCurrentPosition(options);
};

const getGPSPosition = (): Promise<GeoPosition> => {
  const options = {
    ...defaultGeoOptions,
    enableHighAccuracy: true, // GPS
  };

  return GeolocationHelper.getCurrentPosition(options);
};

const showPositionError = (dispatch, actions, retry) => {
  let snackBar: SnackbarState = {
    type: 'error',
    text: 'Error al obtener ubicación',
  };
  if (retry) {
    snackBar = {
      ...snackBar,
      action: {
        label: 'Reintentar',
        onPress: retry,
      },
    };
  }
  dispatch(actions.showSnackbar(snackBar));
};

const getCurrentPosition = (retry?: () => any) => async (
  dispatch,
  getState
): Promise<GeoPosition> => {
  const MAX_ACCURACY = 100;

  // Choose geo-position method.
  const state: { app: MainState } = getState();
  let getPositionPromise: Promise<GeoPosition>;
  const lastAccuracy = state.app.currentPosition?.coords.accuracy;
  if (lastAccuracy && lastAccuracy > MAX_ACCURACY) {
    // If previous accuracy was bad, try again with GPS.
    getPositionPromise = getGPSPosition();
  } else {
    // Try with network by default
    getPositionPromise = getNetworkPosition();
  }

  const { actions } = appSlice;
  return getPositionPromise
    .then(position => {
      dispatch(actions.saveCurrentPosition(position));
      if (position.coords.accuracy > MAX_ACCURACY) {
        showPositionError(dispatch, actions, retry);
        throw { code: PositionError.POSITION_UNAVAILABLE };
      }
      return position;
    })
    .catch((error: PositionError) => {
      if (error === PositionError.PERMISSION_DENIED) {
        dispatch(
          actions.showSnackbar({
            type: 'error',
            text: 'Debe aceptar los permisos',
            action: {
              label: 'Ver permisos',
              onPress: () => Linking.openSettings(),
            },
          })
        );
      } else {
        showPositionError(dispatch, actions, retry);
      }
      throw error;
    });
};

appSlice.actions['getCurrentPosition'] = getCurrentPosition;

export default appSlice;
