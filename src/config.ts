import { Platform } from 'react-native';

import { CardStyleInterpolators } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { theme } from './theme';

export const defaultNavigationOptions = {
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: theme.colors.primary,
  },
  headerBackTitleVisible: false,
  headerPressColorAndroid: theme.colors.transparentWhite,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  // Fix header jump
  // https://github.com/react-navigation/react-navigation/issues/5936
  // Set top=0 for Android, top=44 for iPhone X and top=20 for other iPhone's
  safeAreaInsets: {
    top: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
  },
};
