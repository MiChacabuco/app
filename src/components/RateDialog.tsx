import React from 'react';
import { Linking } from 'react-native';

import { Paragraph } from 'react-native-paper';

import ConfirmationDialog from './ConfirmationDialog';
import { JsonStorageHelper } from '../helpers/JsonStorageHelper';
import environment from '../environment';
import { START_APP_COUNT_KEY, USER_HAS_RATED_KEY } from '../constants';

interface RateDialogState {
  isVisible: boolean;
}

class RateDialog extends React.Component<any, RateDialogState> {
  state = {
    isVisible: false,
  };

  componentDidMount() {
    this.init();
  }

  async init() {
    const userHasRated = await JsonStorageHelper.getItem(
      USER_HAS_RATED_KEY,
      false
    );
    if (userHasRated) {
      // User already rated, don't show the dialog.
      return;
    }
    const startAppCount = await JsonStorageHelper.getItem(
      START_APP_COUNT_KEY,
      1
    );
    JsonStorageHelper.setItem(START_APP_COUNT_KEY, startAppCount + 1);
    if (startAppCount % 3 !== 0) {
      // Show dialog only once every three times the user open the app
      return;
    }
    this.setState({ isVisible: true });
  }

  confirm() {
    this.setState({ isVisible: false });
    Linking.openURL(environment.androidStoreUrl).then(async () => {
      await JsonStorageHelper.setItem(USER_HAS_RATED_KEY, true);
      await JsonStorageHelper.removeItem(START_APP_COUNT_KEY);
    });
  }

  reject() {
    this.setState({ isVisible: false });
  }

  render() {
    return (
      <ConfirmationDialog
        title="¿Te gusta MiChacabuco?"
        isVisible={this.state.isVisible}
        onConfirm={() => this.confirm()}
        onReject={() => this.reject()}
        rejectText="Más tarde"
        confirmText="Calificar"
      >
        <Paragraph>
          Te agradeceríamos que nos dejes una calificación, es fácil y rápido.
        </Paragraph>
      </ConfirmationDialog>
    );
  }
}

export default RateDialog;
