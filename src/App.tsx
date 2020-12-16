import React from 'react';
import { Platform, StatusBar } from 'react-native';

import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import CodePush from 'react-native-code-push';
import firebase from 'react-native-firebase';

import { theme } from './theme';
import AppNavigator from './navigation/AppNavigator';
import { persistor, store } from './configureStore';
import AppSnackbar from './components/AppSnackbar';
import BusinessFAB from './features/businesses/screens/business-detail/components/BusinessFAB';
import RateDialog from './components/RateDialog';
import { NotificationsHelper } from './helpers/NotificationsHelper';
import { LinksHelper } from './helpers/LinksHelper';

interface AppState {
  initialized: boolean;
}

class App extends React.Component<any, AppState> {
  state = {
    initialized: false,
  };

  codePushStatusDidChange(status) {
    if (this.state.initialized) {
      // Already initialized, do nothing.
      return;
    }

    const { SyncStatus } = CodePush;
    const loadingStatuses = [
      SyncStatus.SYNC_IN_PROGRESS,
      SyncStatus.CHECKING_FOR_UPDATE,
      SyncStatus.AWAITING_USER_ACTION,
      SyncStatus.DOWNLOADING_PACKAGE,
      SyncStatus.INSTALLING_UPDATE,
    ];
    if (loadingStatuses.find(s => s === status)) {
      // CodePush not ready, abort.
      return;
    }
    this.init();
  }

  init() {
    this.setState({ initialized: true });
    NotificationsHelper.init();
    LinksHelper.init();
    this.getInitialNotification();
    this.getInitialLink();
  }

  getInitialLink() {
    firebase
      .links()
      .getInitialLink()
      .then(link => {
        if (link) {
          // The app was opened by opening a deep-link
          LinksHelper.handleLinkOpened(link);
        }
      });
  }

  getInitialNotification() {
    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          // The app was opened by tapping on a notification
          NotificationsHelper.handleNotificationOpened(notificationOpen);
        }
      });
  }

  render() {
    return (
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={theme}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={theme.colors.primary}
            />
            {Platform.OS === 'android' && this.state.initialized && (
              <RateDialog />
            )}
            <BusinessFAB />
            <AppNavigator uriPrefix="michacabuco://" />
            <AppSnackbar />
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    );
  }
}

export default CodePush({
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  updateDialog: {
    title: 'Actualización disponible',
    optionalUpdateMessage: 'Hay una actualización disponible',
    optionalIgnoreButtonLabel: 'Ignorar',
    optionalInstallButtonLabel: 'Instalar',
    mandatoryUpdateMessage: 'La app necesita ser actualizada',
    mandatoryContinueButtonLabel: 'Actualizar',
  },
})(App);
