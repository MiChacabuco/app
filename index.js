/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import * as Sentry from '@sentry/react-native';

import App from './src/App';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings(['No stops in gradient']);

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
});

if (!__DEV__) {
  Sentry.init({
    dsn: 'https://c8c0c1d65c9d4a8b92f6a59c16b4516e@sentry.io/1867598',
  });
}

AppRegistry.registerComponent(appName, () => App);
