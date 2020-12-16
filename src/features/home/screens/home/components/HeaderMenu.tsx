import React from 'react';
import { Linking, Platform } from 'react-native';

import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { Appbar, Divider, Menu } from 'react-native-paper';

import environment from '../../../../../environment';
import { JsonStorageHelper } from '../../../../../helpers/JsonStorageHelper';
import {
  START_APP_COUNT_KEY,
  USER_HAS_RATED_KEY,
} from '../../../../../constants';

interface HeaderMenuProps {
  navigation: NavigationScreenProp<any>;
}

interface HeaderMenuState {
  isVisible: boolean;
}

class HeaderMenu extends React.Component<HeaderMenuProps, HeaderMenuState> {
  state = {
    isVisible: false,
  };

  goToAboutUs() {
    this.props.navigation.navigate('AboutUs');
    this.hide();
  }

  openSubscriptionForm() {
    Linking.openURL(environment.subscriptionFormUrl).then(() => {
      this.hide();
    });
  }

  rateApp() {
    Linking.openURL(environment.androidStoreUrl).then(async () => {
      await JsonStorageHelper.setItem(USER_HAS_RATED_KEY, true);
      await JsonStorageHelper.removeItem(START_APP_COUNT_KEY);
    });
  }

  show() {
    this.setState({ isVisible: true });
  }

  hide() {
    this.setState({ isVisible: false });
  }

  render() {
    return (
      <Menu
        visible={this.state.isVisible}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            color="#fff"
            onPress={() => this.show()}
          />
        }
        onDismiss={() => this.hide()}
      >
        {/* <Menu.Item title="Configuración" /> */}
        <Menu.Item
          title="Publicar mi negocio"
          onPress={() => this.openSubscriptionForm()}
        />
        {Platform.OS === 'android' && (
          <Menu.Item title="Calificar app" onPress={() => this.rateApp()} />
        )}
        <Divider />
        <Menu.Item title="Sobre nosotros" onPress={() => this.goToAboutUs()} />
      </Menu>
    );
  }
}

export default withNavigation(HeaderMenu);
