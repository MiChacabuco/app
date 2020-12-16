import React from 'react';
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

const ANDROID_LOLLIPOP = 21;

const Touchable = (props: any) => {
  if (Platform.OS === 'android' && Platform.Version >= ANDROID_LOLLIPOP) {
    return <TouchableNativeFeedback {...props} />;
  } else {
    return <TouchableOpacity {...props} />;
  }
};

export default Touchable;
