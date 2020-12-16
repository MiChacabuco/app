import React from 'react';
import { StyleSheet, View } from 'react-native';

import { HeaderTitle } from 'react-navigation-stack';

import BusinessAvatar from '../../../components/BusinessAvatar';
import { Business } from '../../../models/business';

interface BusinessDetailHeaderTitleProps {
  business: Business;
}

const BusinessDetailHeaderTitle = (props: BusinessDetailHeaderTitleProps) => (
  <View style={styles.container}>
    <BusinessAvatar business={props.business} size={40} imageSize={56} />
    <HeaderTitle style={styles.title}>Información</HeaderTitle>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    marginLeft: 12,
  },
});

export default BusinessDetailHeaderTitle;
