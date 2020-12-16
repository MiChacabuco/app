import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Appbar } from 'react-native-paper';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

interface BusinessesSearchButtonState {
  isActive: boolean;
}

interface BusinessesSearchButtonProps {
  navigation: NavigationScreenProp<any>;
}

class BusinessesSearchButton extends React.Component<
  BusinessesSearchButtonProps,
  BusinessesSearchButtonState
> {
  state = {
    isActive: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      activateSearch: () => this.activateSearch(),
    });
  }

  activateSearch() {
    const doActivateSearch = this.props.navigation.getParam('doActivateSearch');
    if (doActivateSearch) {
      doActivateSearch();
      this.setState({ isActive: true });
    }
  }

  clear() {
    const clearSearchFn = this.props.navigation.getParam('clearSearchFn');
    if (clearSearchFn) {
      clearSearchFn();
      this.setState({ isActive: false });
    }
  }

  render() {
    return (
      <View>
        <Appbar.Action
          onPress={() => this.clear()}
          icon="close"
          color="#fff"
          style={!this.state.isActive && styles.hidden}
        />
        <Appbar.Action
          onPress={() => this.activateSearch()}
          icon="magnify"
          color="#fff"
          style={this.state.isActive && styles.hidden}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hidden: { display: 'none' },
});

export default withNavigation(BusinessesSearchButton);
