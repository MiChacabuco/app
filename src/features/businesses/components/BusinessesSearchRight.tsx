import React from 'react';
import { View } from 'react-native';

import HeaderMenu from '../../home/screens/home/components/HeaderMenu';
import BusinessesSearchButton from './BusinessesSearchButton';

const BusinessesSearchRight = () => (
  <View style={{ flexDirection: 'row' }}>
    <BusinessesSearchButton />
    <HeaderMenu />
  </View>
);

export default BusinessesSearchRight;
