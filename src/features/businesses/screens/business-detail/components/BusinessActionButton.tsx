import React from 'react';
import { StyleSheet } from 'react-native';

import { IconButton } from 'react-native-paper';

interface BusinessActionButtonProps {
  onPress: () => any;
  icon: string;
  backgroundColor: string;
}

const BUTTON_SIZE = 56;

const BusinessActionButton = (props: BusinessActionButtonProps) => (
  <IconButton
    {...props}
    color="white"
    size={BUTTON_SIZE / 2}
    style={[styles.icon, { backgroundColor: props.backgroundColor }]}
  />
);

const styles = StyleSheet.create({
  icon: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    borderColor: '#eee',
  },
});

export default BusinessActionButton;
