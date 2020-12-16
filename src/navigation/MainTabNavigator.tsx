import React from 'react';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import { theme } from '../theme';
import HomeStack from '../features/home/stack';
import BusinessesStack from '../features/businesses/stack';
import TabIcon from '../components/TabIcon';

const MainTabNavigator = createMaterialBottomTabNavigator(
  {
    HomeStack: {
      screen: HomeStack,
      path: 'home',
      navigationOptions: ({ navigation }) => {
        const tabBarLabel = 'Inicio';
        const tabBarIcon = ({ focused }) => (
          <TabIcon name="home" focused={focused} />
        );
        const tabBarVisible =
          navigation.state.routes[navigation.state.index].params?.showTabBar ??
          true;
        return { tabBarLabel, tabBarIcon, tabBarVisible };
      },
    },
    BusinessesStack: {
      screen: BusinessesStack,
      path: 'businesses',
      navigationOptions: {
        tabBarLabel: 'Guía',
        tabBarIcon: ({ focused }) => (
          <TabIcon name="contacts" focused={focused} />
        ),
      },
    },
  },
  {
    barStyle: {
      backgroundColor: '#fff',
    },
    activeColor: theme.colors.accent,
    keyboardHidesNavigationBar: false,
  }
);

export default MainTabNavigator;
