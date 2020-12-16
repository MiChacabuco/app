import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5',
    accent: '#3880ff',
    transparentWhite: 'rgba(255, 255, 255, 0.5)',
  },
};

// Snackbar
const snackBarTheme = {
  roundness: 8,
  colors: {
    accent: '#fff', // For action button
  },
};

export const snackbarInfoTheme = {
  ...snackBarTheme,
  colors: {
    ...snackBarTheme.colors,
    onSurface: '#0091ea',
  },
};

export const snackbarSuccessTheme = {
  ...snackBarTheme,
  colors: {
    ...snackBarTheme.colors,
    onSurface: '#00c853',
  },
};

export const snackbarErrorTheme = {
  ...snackBarTheme,
  colors: {
    ...snackBarTheme.colors,
    onSurface: '#d50000',
  },
};
