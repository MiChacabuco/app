import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';

import appSlice, { MainState, SnackbarState } from '../reducers/slices';
import {
  snackbarErrorTheme,
  snackbarInfoTheme,
  snackbarSuccessTheme,
} from '../theme';

const typeThemeMap = {
  info: snackbarInfoTheme,
  success: snackbarSuccessTheme,
  error: snackbarErrorTheme,
};

const AppSnackbar = () => {
  const dispatch = useDispatch();
  const snackbar: SnackbarState = useSelector(
    (state: { app: MainState }) => state.app.snackbar
  );

  const hide = () => {
    const { hideSnackbar } = appSlice.actions;
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      visible={!!snackbar.isVisible}
      onDismiss={hide}
      duration={Snackbar.DURATION_SHORT}
      action={snackbar.action}
      theme={typeThemeMap[snackbar.type]}
      style={{ marginBottom: 16 }}
    >
      {snackbar.text}
    </Snackbar>
  );
};

export default AppSnackbar;
