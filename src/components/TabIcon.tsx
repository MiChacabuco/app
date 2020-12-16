import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';

import { theme } from '../theme';

interface TabIconProps {
  name: string;
  focused: boolean;
}

const TabIcon = (props: TabIconProps) => (
  <AntDesign
    name={props.name}
    size={24}
    color={props.focused ? theme.colors.accent : '#777'}
  />
);

export default TabIcon;
