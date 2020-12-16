import React from 'react';
import { StyleSheet } from 'react-native';

import { Button } from 'react-native-paper';

const PillButton = props => (
  <Button
    mode="contained"
    {...props}
    style={[{ borderRadius: 32 }, props.style]}
    contentStyle={styles.button}
  >
    {props.children}
  </Button>
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default PillButton;
