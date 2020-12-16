import { PermissionsAndroid, Platform } from 'react-native';

import Geolocation, {
  GeoOptions,
  GeoPosition,
  PositionError,
} from 'react-native-geolocation-service';

const isAndroid = Platform.OS === 'android';

export const GeolocationHelper = {
  requestPermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isAndroid) {
        const { ACCESS_FINE_LOCATION } = PermissionsAndroid.PERMISSIONS;
        PermissionsAndroid.request(ACCESS_FINE_LOCATION).then(result => {
          if (result === 'granted') {
            resolve();
          } else {
            reject();
          }
        });
      } else {
        resolve();
      }
    });
  },
  getCurrentPosition(options: GeoOptions = {}): Promise<GeoPosition> {
    return new Promise((resolve, reject) => {
      GeolocationHelper.requestPermission()
        .then(() => {
          Geolocation.getCurrentPosition(
            position => {
              resolve(position);
            },
            (e: Geolocation.GeoError) => {
              reject(e.code);
            },
            options
          );
        })
        .catch(() => {
          reject(PositionError.PERMISSION_DENIED);
        });
    });
  },
};
