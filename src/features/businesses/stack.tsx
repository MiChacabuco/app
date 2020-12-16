import React from 'react';
import {
  createStackNavigator,
  NavigationStackProp,
} from 'react-navigation-stack';

import BusinessesListScreen from './screens/businesses-list/BusinessesListScreen';
import BusinessDetailScreen from './screens/business-detail/BusinessDetailScreen';
import BusinessDetailHeaderTitle from './screens/business-detail/components/BusinessDetailHeaderTitle';
import BusinessesSearchRight from './components/BusinessesSearchRight';
import BusinessesSearchBar from './components/BusinessesSearchBar';
import { Business } from './models/business';
import { defaultNavigationOptions } from '../../config';

export const BusinessDetail = {
  screen: BusinessDetailScreen,
  path: 'detail/:id',
  navigationOptions: (props: { navigation: NavigationStackProp }) => {
    const { navigation } = props;
    const business: Business = navigation.getParam('business');
    if (navigation.getParam('isSlim') || !business.avatar) {
      return {
        title: 'Información',
      };
    } else {
      return {
        headerTitle: () => <BusinessDetailHeaderTitle business={business} />,
      };
    }
  },
};

const BusinessesStack = createStackNavigator(
  {
    BusinessesSearch: {
      screen: BusinessesListScreen,
      path: 'search',
      navigationOptions: {
        headerTitle: () => <BusinessesSearchBar />,
        headerRight: () => <BusinessesSearchRight />,
      },
    },
    BusinessDetail,
  },
  {
    defaultNavigationOptions,
  }
);

export default BusinessesStack;
