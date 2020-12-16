import React from 'react';
import { Linking, StyleSheet } from 'react-native';

import { Text } from 'react-native-paper';

interface LinkProps {
  text: string;
  url: string;
  style: {};
}

const Link = (props: LinkProps) => (
  <Text
    onPress={() => Linking.openURL(props.url)}
    style={[styles.link, props.style]}
  >
    {props.text}
  </Text>
);

const styles = StyleSheet.create({
  link: {
    color: '#0000EE',
  },
});

export default Link;
