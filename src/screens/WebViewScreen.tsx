import React from 'react';

import { NavigationScreenProp } from 'react-navigation';
import WebView from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';

import { theme } from '../theme';

interface WebViewScreenProps {
  navigation: NavigationScreenProp<any>;
}

const WebViewScreen = (props: WebViewScreenProps) => {
  const webViewProps = props.navigation.getParam('webViewProps');

  const renderLoading = () => (
    <ActivityIndicator
      color={theme.colors.accent}
      size="large"
      style={{ height: '100%' }}
    />
  );

  return (
    <WebView
      {...webViewProps}
      startInLoadingState={true}
      renderLoading={() => renderLoading()}
      style={{ flex: 1 }}
    />
  );
};
WebViewScreen.navigationOptions = ({
  navigation,
}: {
  navigation: NavigationScreenProp<any>;
}) => ({
  title: navigation.getParam('title', ''),
});

export default WebViewScreen;
