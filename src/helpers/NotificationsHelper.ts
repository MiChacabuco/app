import { Linking, Platform } from 'react-native';

import firebase from 'react-native-firebase';
import { NotificationOpen } from 'react-native-firebase/notifications';

import { JsonStorageHelper } from './JsonStorageHelper';
import environment from '../environment';

const FCM_TOKEN_KEY = 'fcm_token';

export const NotificationsHelper = {
  async init() {
    const messaging = firebase.messaging();
    try {
      await messaging.requestPermission();
    } catch (e) {
      // Permissions not granted (iOS)
    }
    if (Platform.OS === 'ios') {
      await messaging.ios.registerForRemoteNotifications();
    }
    firebase
      .notifications()
      .onNotificationOpened(NotificationsHelper.handleNotificationOpened);
    messaging.getToken().then(token => {
      NotificationsHelper.saveToken(token);
    });
    messaging.onTokenRefresh(token => {
      NotificationsHelper.saveToken(token);
    });
    await messaging.subscribeToTopic('all');
    messaging.onMessage(message => {
      NotificationsHelper.handleMessage(message);
    });
  },
  getToken(): Promise<string> {
    return JsonStorageHelper.getItem(FCM_TOKEN_KEY);
  },
  saveToken(token: string): Promise<void> {
    return JsonStorageHelper.setItem(FCM_TOKEN_KEY, token);
  },
  handleMessage(message) {
    console.log(message);
  },
  handleNotificationOpened(notificationOpen: NotificationOpen) {
    const path = notificationOpen.notification.data?.path;
    // If the notification has a path, redirect to it.
    if (path) {
      const url = `${environment.schema}${path}`;
      Linking.openURL(url);
    }
  },
};
